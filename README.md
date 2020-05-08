# DragToGo+
This is a re-work to my previous firefox addon [DragToGo](https://github.com/kun-fang/firefox-extension-drag-to-go). Compare to DragToGo, this one provides more options to different mouse gestures so that it resembles more of Easy DragToGo++ in older firefox versions. This addon uses better ways to achieve more functions and makes it easier to add new features.

## Screenshots
* Options for text
![Text Options](/docs/screenshots/Screen_Shot_2.png)

* Optinos for links
![Link Options](/docs/screenshots/Screen_Shot_3.png)

* Options for images
![Image Options](/docs/screenshots/Screen_Shot_4.png)

## Supported Features:
* For Text:
  * Search for the text using a search engine
  * Copy the text to clipboard
  * Save the text to a text file
  * Find the text in the same page (_experimental_)

* For Links:
  * Open the link
  * Save the link
  * Bookmark the link

* For Images:
  * Open the image
  * Save the image
  * Open the link if the image is enclosed by an `<a></a>` element which points to a different url from the image url. If not, it will fallback to open the image.

## Know issues:
1. svg images in `<svg>` tag is not supported.
2. If the dragged element includes not only an image but also a lot of text (even if the text is hidden), the addon will ignore the image.
3. Find in page only search forward and sometimes buggy.

## How to build the addon locally

### Prerequisites
* The project uses `npm` to build, so please install [npm](https://www.npmjs.com/get-npm) first.
* git clone or download the project to your local machine

### Build the Addon
1. install dependencies
```
npm install
```

2. bulid the addon for debugging purpose:
```
npm run build
```
This command will generate addon files in `build` folder. The addon files can be [installed to firefox temporarily](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) with various [debugging tools](https://extensionworkshop.com/documentation/develop/debugging/).

3. build the addon for release:
```
npm run release
```
This command will generate addon files in `release` folder where code is compressed/minified for release. At the same time a zip file is generated in `artifacts` folder, which includes all the files in `release` folder. The zip file is ready to upload to firefox.

## Contributing
Simple fork the repo and send pull request

## License
This project is licensed under the [Mozilla Public License](/LICENSE)
