import {
	DisconnectReason,
	NetworkSettingsPacket,
	RequestNetworkSettingsPacket
} from "@serenityjs/protocol";

import { NetworkHandler } from "./network-handler";

import type { Packet } from "@serenityjs/protocol";
import type { NetworkSession } from "../session";

class RequestNetworkSettingsHandler extends NetworkHandler {
	/**
	 * The packet of the network handler.
	 */
	public static override packet: Packet = RequestNetworkSettingsPacket.id;

	public static override handle(
		packet: RequestNetworkSettingsPacket,
		session: NetworkSession
	): void {
		// Check if the client is using the correct protocol version.
		const protocol = this.serenity.protocol;

		// Check is the servers protocol is greater than the clients protocol.
		// This would mean the client needs to be updated.
		// Also check if the servers protocol is less than the clients protocol.
		// This would mean the server needs to be updated.
		if (protocol > packet.protocol) {
			return session.disconnect(
				"Outdated client! Please use the latest version of Minecraft Bedrock.",
				DisconnectReason.OutdatedClient
			);
		} else if (protocol < packet.protocol) {
			return session.disconnect(
				"Outdated server! Please wait for the server to update.",
				DisconnectReason.OutdatedServer
			);
		}

		// Now we will send the network settings to the client.
		// The client will use these settings to configure their network.
		// I believe nintendo switch has a different compression threshold, not positive though. Needs testing.
		const settings = new NetworkSettingsPacket();
		settings.compressionThreshold = session.network.compressThreshold;
		settings.compressionMethod = session.network.compressMethod;
		settings.clientThrottle = false;
		settings.clientThreshold = 0;
		settings.clientScalar = 0;

		// Send the settings to the client.
		session.sendImmediate(settings);

		// Set the compression to true.
		// For here on out, all packets will be compressed.
		session.compression = true;
	}
}

export { RequestNetworkSettingsHandler };