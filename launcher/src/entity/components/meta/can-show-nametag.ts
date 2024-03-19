import { MetadataFlags, MetadataType } from "@serenityjs/protocol";

import { EntityMetaComponent } from "./meta";

class EntityCanShowNametagComponent extends EntityMetaComponent {
	public readonly identifier = "minecraft:can_show_nametag";

	public readonly flag = true;

	public readonly key = MetadataFlags.CanShowNametag;

	public readonly type = MetadataType.Long;

	public defaultValue = true;

	public currentValue = this.defaultValue;
}

export { EntityCanShowNametagComponent };