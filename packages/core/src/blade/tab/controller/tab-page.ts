import {bindValueMap} from '../../../common/model/reactive';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {PlainView} from '../../../common/view/plain';
import {ContainerBladeController} from '../../common/controller/container-blade';
import {RackController} from '../../common/controller/rack';
import {Blade} from '../../common/model/blade';
import {TabItemProps} from '../view/tab-item';
import {TabPageView} from '../view/tab-page';
import {TabItemController} from './tab-item';

export type TabPagePropsObject = {
	selected: boolean;
};

export type TabPageProps = ValueMap<TabPagePropsObject>;

interface Config {
	blade: Blade;
	itemProps: TabItemProps;
	props: TabPageProps;
	viewProps: ViewProps;
}

export class TabPageController extends ContainerBladeController<PlainView> {
	public readonly props: TabPageProps;
	private readonly ic_: TabItemController;

	constructor(doc: Document, config: Config) {
		const view = new TabPageView(doc, {
			viewProps: config.viewProps,
		});
		super({
			...config,
			rackController: new RackController({
				blade: config.blade,
				element: view.containerElement,
				viewProps: config.viewProps,
			}),
			view: view,
		});

		this.onItemClick_ = this.onItemClick_.bind(this);

		this.ic_ = new TabItemController(doc, {
			props: config.itemProps,
			viewProps: ViewProps.create(),
		});
		this.ic_.emitter.on('click', this.onItemClick_);

		this.props = config.props;
		bindValueMap(this.props, 'selected', (selected) => {
			this.itemController.props.set('selected', selected);
			this.viewProps.set('hidden', !selected);
		});
	}

	get itemController(): TabItemController {
		return this.ic_;
	}

	private onItemClick_(): void {
		this.props.set('selected', true);
	}
}
