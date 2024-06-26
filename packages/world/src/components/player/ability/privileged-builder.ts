import { AbilityLayerFlag, AbilitySet } from "@serenityjs/protocol";

import { PlayerAbilityComponent } from "./ability";

import type { Player } from "../../../player";

class PlayerPrivilegedBuilderComponent extends PlayerAbilityComponent {
	public readonly flag = AbilityLayerFlag.PrivilegedBuilder;

	public readonly defaultValue = false;

	public currentValue = this.defaultValue;

	/**
	 * Creates a new player privileged builder component.
	 *
	 * @param player The player the component is binded to.
	 * @returns A new player privileged builder component.
	 */
	public constructor(player: Player) {
		super(player, AbilitySet.PrivilegedBuilder);
	}
}

export { PlayerPrivilegedBuilderComponent };
