import { ZigZag } from "@serenityjs/binaryutils";
import { Proto, Serialize } from "@serenityjs/raknet";

import { LevelEvent, Packet } from "../../enums";
import { Vector3f } from "../types";

import { DataPacket } from "./data-packet";

@Proto(Packet.LevelEvent)
class LevelEventPacket extends DataPacket {
	@Serialize(ZigZag) public event!: LevelEvent;
	@Serialize(Vector3f) public position!: Vector3f;
	@Serialize(ZigZag) public data!: number;
}

export { LevelEventPacket };
