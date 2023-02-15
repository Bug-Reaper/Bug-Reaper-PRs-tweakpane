import {View} from '../../../common/view/view';
import {Blade} from '../model/blade';
import {BladeController} from './blade';
import {RackController} from './rack';

interface Config<V extends View> {
	blade: Blade;
	rackController: RackController;
	view: V;
}

export class ContainerBladeController<
	V extends View = View,
> extends BladeController<V> {
	public readonly rackController: RackController;

	constructor(config: Config<V>) {
		super({
			blade: config.blade,
			view: config.view,
			viewProps: config.rackController.viewProps,
		});
		this.rackController = config.rackController;
	}
}
