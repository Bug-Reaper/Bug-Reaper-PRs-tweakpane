import {Emitter, EventTypeMap} from '../misc/emitter';
import {TypeUtil} from '../misc/type-util';

type ChangeEventPropertyName =
	| 'expanded'
	| 'expandedHeight'
	| 'shouldFixHeight'
	| 'temporaryExpanded';

/**
 * @hidden
 */
export interface FolderEvents extends EventTypeMap {
	beforechange: {
		propertyName: ChangeEventPropertyName;
		sender: Folder;
	};
	change: {
		propertyName: ChangeEventPropertyName;
		sender: Folder;
	};
}

/**
 * @hidden
 */
export class Folder {
	public readonly emitter: Emitter<FolderEvents>;
	public readonly title: string;
	private expandedHeight_: number | null;
	private expanded_: boolean;
	private shouldFixHeight_: boolean;
	// For computing expanded height
	private temporaryExpanded_: boolean | null;

	constructor(title: string, expanded: boolean) {
		this.emitter = new Emitter();
		this.expanded_ = expanded;
		this.expandedHeight_ = null;
		this.temporaryExpanded_ = null;
		this.shouldFixHeight_ = false;
		this.title = title;
	}

	get expanded(): boolean {
		return this.expanded_;
	}

	set expanded(expanded: boolean) {
		const changed = this.expanded_ !== expanded;
		if (!changed) {
			return;
		}

		this.emitter.emit('beforechange', {
			propertyName: 'expanded',
			sender: this,
		});

		this.expanded_ = expanded;

		this.emitter.emit('change', {
			propertyName: 'expanded',
			sender: this,
		});
	}

	get temporaryExpanded(): boolean | null {
		return this.temporaryExpanded_;
	}

	set temporaryExpanded(expanded: boolean | null) {
		const changed = this.temporaryExpanded_ !== expanded;
		if (!changed) {
			return;
		}

		this.emitter.emit('beforechange', {
			propertyName: 'temporaryExpanded',
			sender: this,
		});

		this.temporaryExpanded_ = expanded;

		this.emitter.emit('change', {
			propertyName: 'temporaryExpanded',
			sender: this,
		});
	}

	get expandedHeight(): number | null {
		return this.expandedHeight_;
	}

	set expandedHeight(expandedHeight: number | null) {
		const changed = this.expandedHeight_ !== expandedHeight;
		if (!changed) {
			return;
		}

		this.emitter.emit('beforechange', {
			propertyName: 'expandedHeight',
			sender: this,
		});

		this.expandedHeight_ = expandedHeight;

		this.emitter.emit('change', {
			propertyName: 'expandedHeight',
			sender: this,
		});
	}

	get shouldFixHeight(): boolean {
		return this.shouldFixHeight_;
	}

	set shouldFixHeight(shouldFixHeight: boolean) {
		const changed = this.shouldFixHeight_ !== shouldFixHeight;
		if (!changed) {
			return;
		}

		this.emitter.emit('beforechange', {
			propertyName: 'shouldFixHeight',
			sender: this,
		});

		this.shouldFixHeight_ = shouldFixHeight;

		this.emitter.emit('change', {
			propertyName: 'shouldFixHeight',
			sender: this,
		});
	}

	get styleExpanded(): boolean {
		return TypeUtil.getOrDefault(this.temporaryExpanded, this.expanded);
	}

	get styleHeight(): string {
		if (!this.styleExpanded) {
			return '0';
		}

		if (this.shouldFixHeight && !TypeUtil.isEmpty(this.expandedHeight)) {
			return `${this.expandedHeight}px`;
		}

		return 'auto';
	}
}
