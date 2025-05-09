# myMarkmap

[myMarkmap](https://mymarkmap.forge.apps.education.fr/) is a free and open-source tool that allows you to easily create and share interactive mind maps, using Markdown text.

[![](https://raw.githubusercontent.com/eyssette/myMarkmap/main/myMarkmap-explications.png)](https://mymarkmap.forge.apps.education.fr/)

## ⚙️ Why use Markdown?

Using Markdown to create mind maps offers several advantages:
1. **Simplicity:** Markdown is a simple and intuitive syntax that doesn't require advanced technical skills; you can quickly [learn the basics](https://commonmark.org/help/).
2. **Focus on content:** unlike traditional graphical tools where you might spend time visually adjusting elements, here you simply write your ideas and the mind map hierarchy naturally forms with heading levels.
3. **Efficiency and speed:** if you're comfortable with keyboard typing, creating a mind map in Markdown is much faster than with a traditional graphical interface, and you can easily modify it or reconfigure it with copy and paste. You can also easily create a mind map from a text document you already have (AI can also facilitate conversion).
4. **Lightweight and open format:** your mind map is simply text, which means it will be very lightweight, will always remain readable without depending on specific software, and you can also convert your mind map for use in other contexts.

## ✨ Main Features

### Integrated Editor
- Edit your map by clicking on ✒️ in the top left (or using the "e" key)
- View only the map by clicking on 👓 (or using the "Escape" key)

### Idea Organization
- Use Markdown headings to create levels
  - `# Title` (level 1)
  - `## Subtitle` (level 2)
- Or bullet lists to organize your map
  - For sub-levels, add two spaces before the dash

### Saving and Sharing
- Save as SVG or HTML format, or create a sharing link
- Possibility to share a mind map from a Markdown file on [CodiMD](codimd.apps.education.fr) or another service, by putting your file's URL in the `hash`: `https://mymarkmap.forge.apps.education.fr/#URL_OF_MARKDOWN_FILE`

### Map Navigation
- Ability to show or hide branches
- Ability to show or hide parts of the text
- Automatic resizing

### More Advanced Configuration Options
- Customize the display with themes: `focus`, `nolines`, or with CSS styles
- Control interactivity: automatic focus on the current branch, removal of resizing...

For more information, see the [default mind map](https://mymarkmap.forge.apps.education.fr/)  displayed on the application.

## 🙋‍♀️ Contributing

If you would like to contribute or simply discuss this project to help improve it, please read the [CONTRIBUTING.md](https://forge.apps.education.fr/myMarkmap/myMarkmap.forge.apps.education.fr/-/blob/main/CONTRIBUTING.md?ref_type=heads) file.

## 👩‍⚖️ License

[myMarkmap](https://mymarkmap.forge.apps.education.fr/) is distributed under the MIT license.

The source code is available on the [Forge des Communs Numériques Éducatifs](https://forge.apps.education.fr/myMarkmap/myMarkmap.forge.apps.education.fr).

## 🙏 Credits

[myMarkmap](https://mymarkmap.forge.apps.education.fr/) is primarily based on the [markmap](https://markmap.js.org/) software.

The development relies on the [SvelteKit](https://svelte.dev/) framework.

Other packages are used: see the [list of dependencies](https://forge.apps.education.fr/myMarkmap/myMarkmap.forge.apps.education.fr/-/blob/main/package.json?ref_type=heads).