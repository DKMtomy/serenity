import type { BinaryStream } from '@serenityjs/binarystream';
import { Endianness } from '@serenityjs/binarystream';
import { DataType } from '@serenityjs/raknet-protocol';
import type { MetadataFlags } from '../enums';
import { MetadataType, MetadataKey } from '../enums';
import { Vector3f } from './Vector3f';

interface Metadata<T> {
	flag?: MetadataFlags;
	key: MetadataKey;
	type: MetadataType;
	value: T;
}

class MetadataDictionary extends DataType {
	public static override read(stream: BinaryStream): Metadata<any>[] {
		// Prepare an array to store the metadata.
		const metadata: Metadata<any>[] = [];

		// Read the number of metadata.
		const amount = stream.readVarInt();

		// We then loop through the amount of metadata.
		// Reading the individual fields in the stream.
		for (let i = 0; i < amount; i++) {
			// Read all the fields for the metadata.
			const key = stream.readVarInt() as MetadataKey;
			const type = stream.readByte();
			let value: Metadata<any>['value'] = null;

			if (key === MetadataKey.Flags) {
				console.log('FLAGS');
			} else if (key === MetadataKey.FlagsExtended) {
				console.log('FLAGSEXTENDED');
			}

			// Read the value for the metadata.
			switch (type) {
				case MetadataType.Byte:
					value = stream.readByte();
					break;
				case MetadataType.Short:
					value = stream.readInt16(Endianness.Little);
					break;
				case MetadataType.Int:
					value = stream.readZigZag();
					break;
				case MetadataType.Float:
					value = stream.readFloat32(Endianness.Little);
					break;
				case MetadataType.String:
					value = stream.readVarString();
					break;
				case MetadataType.Compound:
					value = null; // TODO
					break;
				case MetadataType.Vec3i:
					value = null; // TODO
					break;
				case MetadataType.Long:
					value = stream.readZigZong();
					break;
				case MetadataType.Vec3f:
					value = Vector3f.read(stream);
					break;
			}

			// Push the metadata to the array.
			metadata.push({
				key,
				type,
				value,
			});
		}

		// Return the metadata.
		return metadata;
	}

	// TODO: Finish this
	public static override write(stream: BinaryStream, value: Metadata<any>[]): void {
		// Write the number of metadata given in the array.
		stream.writeVarInt(value.length);

		let flagKey = 0n;
		// Loop through the metadata.
		for (const metadata of value) {
			// Write the key for the metadata.
			stream.writeVarInt(metadata.key);

			// Check if the metadata is a flag.
			if (metadata.key === MetadataKey.Flags && metadata.flag) {
				// Write the type for the metadata.
				// In this case, the type is a long.
				stream.writeByte(MetadataType.Long);

				const value = flagKey ^ (1n << BigInt(metadata.flag)); // I think 1n is enabled 0n is disabled
				stream.writeZigZong(value);
				flagKey = value;
			} else if (metadata.key === MetadataKey.FlagsExtended && metadata.flag) {
			} else {
				// Write the fields for the metadata.
				stream.writeByte(metadata.type);

				// Write the value for the metadata.
				switch (metadata.type) {
					case MetadataType.Byte:
						stream.writeByte(metadata.value);
						break;
					case MetadataType.Short:
						stream.writeInt16(metadata.value, Endianness.Little);
						break;
					case MetadataType.Int:
						stream.writeZigZag(metadata.value);
						break;
					case MetadataType.Float:
						stream.writeFloat32(metadata.value, Endianness.Little);
						break;
					case MetadataType.String:
						stream.writeVarString(metadata.value);
						break;
					case MetadataType.Compound:
						break;
					case MetadataType.Vec3i:
						break;
					case MetadataType.Long:
						stream.writeZigZong(metadata.value);
						break;
					case MetadataType.Vec3f:
						Vector3f.write(stream, metadata.value);
						break;
				}
			}
		}
	}
}

export { MetadataDictionary, type Metadata };