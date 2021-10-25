# Gallereakit

> Reakit x Next.js: (Unsplash) Gallery previewer

This project uses [Next.js](https://nextjs.org/) with accessible components from [Reakit](https://reakit.io/docs/dialog/) to create a paginated photo gallery previewing experience (images courtesy of [Unsplash](https://unsplash.com/developers)).

## Approach

### File organization

This project is organized with a ["domain driven development" strategy](https://css-tricks.com/domain-driven-design-with-react/). Instead of splitting _all_ components in a `/components`, and _all_ utils in a `/utils`, the domain (or feature) specific code has been moved into a dedicated `/features` directory.

Everything the feature needs to work will be located in that directory. In the feature, if it needs to grab come from somewhere else, it can do that. For the most part, each feature should stay pretty contained in their domain.

### Reakit Dialog (Modal)

The preview modal in this example is a little different compared to the code snippets provided by [Reakit](https://reakit.io/docs/dialog/). The dialog examples from Reakit suggest a **1:1** relationship between a Modal trigger (e.g. a preview card) and the preview modal itself.

What we need is a **one to many** setup. Where we have many preview cards that open and render a preview in the same shared modal. Because of this, our Reakit Dialog setup will be a little different.

### API Layers

Layers (plural). Next.js provides us with a back-end via their `pages/api/` directory. However, it is useful to create some sort of organized API (middleware) that grabs things from the back-end and tidies up the code for our React components.

### Feature hook logic (e.g. usePhotoGallery)

You don't _have_ to do this. However, I like abstracting as much logic I can into hooks to keep the primary component as simple and tidy as possible. If you do this, the job of the primary component is to stitch everything together.

This approach is very simpler to the composition experience you'd get from Redux. Where Redux does all the heavy lifting and your component flows the ~~state~~ props to it and potential sub-components accordingly.

### ComponentProp Types

(Only pay attention to this if you're interested in TypeScript)

Some of the components in this project extend the base HTML props. For example:

```jsx
type PhotoCardProps = React.ComponentProps<'div'> & PhotoData;
```

This allows for the `PhotoCard` component to be much more flexible as it does a `{...rest}` prop spread underneath.

This technique isn't required if you know your components will be very specific or narrowly scoped. However, it is useful if you're constructing base-level reusable components.

## Development

- Clone and pull down this repo.
- Run `yarn` to install dependencies.
- Run `yarn dev` to start development.
