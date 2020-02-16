/**
 * BLOCK: CF Post List Block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

const {__} = wp.i18n; // Import __() from wp.i18n
const {registerBlockType} = wp.blocks; // Import registerBlockType() from wp.blocks
const {InspectorControls, ColorPalleter, SelectControl} = wp.blockEditor;

const {PanelBody} = wp.components;
const {Component} = wp.element;

class ArticlesComponent extends Component {
	constructor() {
		super(...arguments);
		this.handleChange = this.handleChange.bind(this);
		this.getPosts = this.getPosts.bind(this);
	}

	getPosts(category = '', page, count) {

		let apiPath = '/wp/v2/posts/?page=' + page + '&per_page=' + count;
		if (category) {
			apiPath = '/wp/v2/posts/?categories=' + category + '&page=' + page + '&per_page=' + count
		}

		wp.apiFetch({
			path: apiPath
		}).then(articles => {
			this.props.setAttributes({
				articles: articles
			});
		});
	}

	handleChange(e) {

		if (
			undefined !== e.target.name
			&& undefined !== e.target.value
			|| '' !== e.target.name
			&& '' !== e.target.value
		) {

			if (e.target.name == 'total_posts') {
				this.getPosts(this.props.attributes.category, 1, e.target.value);
				this.props.setAttributes({
					[e.target.name]: parseInt(e.target.value)
				});
			} else if (e.target.name == 'category') {
				this.getPosts(parseInt(e.target.value), 1, this.props.attributes.total_posts);
				this.props.setAttributes({
					category: parseInt(e.target.value)
				});
			} else {
				this.props.setAttributes({
					[e.target.name]: e.target.value
				});
			}

		}
	}

	componentDidMount() {
		console.log('triggered');

		if (!this.props.attributes.categories) {
			wp.apiFetch({
				path: '/wp/v2/categories'
			}).then(categories => {
				this.props.setAttributes({
					categories: categories
				});
			});
		}

		if (!this.props.attributes.articles) {
			this.getPosts(this.props.attributes.category, 1, this.props.attributes.total_posts);
		}
	}


	render() {
		console.log(this.props.attributes);

		const CategoriesSelect = () => {
			return <select className="cf-block-category components-text-control__input"
			               value={this.props.attributes.category ? this.props.attributes.category : ''}
			               onChange={this.handleChange} name='category'>
				<option value='' key={0}>Select category</option>
				{
					this.props.attributes.categories.map(category => {
						return <option value={category.id} key={category.id}>{category.name}</option>;
					})
				}
			</select>;
		};

		const ArticlesList = () => {
			if (!this.props.attributes.articles) {
				return '';
			}

			return (

				<div className={`cf-articles-block ${this.props.attributes.columns_gap}`}>
					{
						this.props.attributes.articles.map((article, index) => {

							const FeaturedImage = () => {
								return <div className='cf-ab-featured-image'><img
									src={article.featured_image_url.thumbnail} alt={article.title.rendered}/></div>;
							};

							const Title = () => {
								return <div className='cf-ab-title'><h1
									key={article.index}>{article.title.rendered}</h1></div>;
							}

							const Excerpt = () => {
								return <div className='cf-ab-excerpt'><p>{article.clean_excerpt}</p></div>;
							}

							const Link = () => {
								return <div className='cf-ab-link'><a
									href={article.link}>{this.props.attributes.link_text}</a></div>;
							}


							return (
								<div
									className={`cf-article-column ${this.props.attributes.row_columns} ${this.props.attributes.columns_gap}`}>
									<FeaturedImage/>
									<Title/>
									<Excerpt/>
									<Link/>
								</div>
							);
						})
					}
				</div>
			);

		};

		return [
			<InspectorControls>

				<PanelBody title={'Articles Setup'} initialOpen={false}>
					<div className="components-base-control">
						<div className="components-base-control__field">
							<label className="components-base-control__label" htmlFor="inspector-text-control-1">
								Select Post Type
							</label>
							<select className="components-text-control__input"
							        defaultValue={this.props.attributes.post_type}
							        name="post_type" onChange={this.handleChange}>
								<option value='post'>Post</option>
							</select>
						</div>
					</div>
					<div className="components-base-control">
						<div className="components-base-control__field">
							<label className="components-base-control__label" htmlFor="inspector-text-control-1">
								Select Category
							</label>
							<CategoriesSelect/>
						</div>
					</div>

					<div className="components-base-control">
						<div className="components-base-control__field">
							<label className="components-base-control__label">
								Total posts &nbsp;&nbsp;
							</label>
							<input type='number' max={12} maxLength={2} name="total_posts"
							       className="components-base-control__input"
							       onChange={this.handleChange}
							       value={this.props.attributes.total_posts}/>
						</div>
					</div>

				</PanelBody>

				<PanelBody title={'Row Setup'} initialOpen={false}>
					<div className="components-base-control">
						<div className="components-base-control__field">
							<label className="components-base-control__label" htmlFor="inspector-text-control-1">
								Columns per row
							</label>
							<select className="components-text-control__input" name="row_columns"
							        onChange={this.handleChange}
							        value={this.props.attributes.row_columns}>
								<option value='one-column'>1</option>
								<option value='two-columns'>2</option>
								<option value='three-columns'>3</option>
								<option value='four-columns'>4</option>
								<option value='five-columns'>5</option>
								<option value='six-columns'>6</option>
							</select>
						</div>
					</div>
					<div className="components-base-control">
						<div className="components-base-control__field">
							<label className="components-base-control__label" htmlFor="inspector-text-control-1">
								Columns Gap
							</label>
							<select className="components-text-control__input" name="columns_gap"
							        onChange={this.handleChange}
							        value={this.props.attributes.columns_gap}>
								<option value='default-gap'>Default (15px)</option>
								<option value='extended-gap'>Extended (30px)</option>
							</select>
						</div>
					</div>
				</PanelBody>
			</InspectorControls>,
			<div>
				<ArticlesList/>
			</div>
		]
	}
}

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('cgb/block-testing-gutenberg-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('CF Post List Block'), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__('CF Post List block'),
		__('CF Post List'),
		__('create-guten-block'),
	],
	attributes: {
		post_type: {
			type: 'object',
			default: 'post',
		},
		categories: {
			type: 'object',
		},
		articles: {
			type: 'object',
		},
		category: {
			type: 'integer',
			default: null,
		},
		total_posts: {
			type: 'integer',
			default: 6,
		},
		row_columns: {
			type: 'string',
			default: 'three-columns',
		},
		columns_gap: {
			type: 'string',
			default: 'default-gap'
		},
		link_text: {
			type: 'string',
			default: 'Read More'
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */

	edit: ArticlesComponent,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: (props) => {
		return null;
	},
});
