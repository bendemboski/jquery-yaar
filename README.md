## jquery.yaar: Yet Another Auto-Resizer for textareas

Version: 1.0, last updated 5/14/2012

### Description
This is a jQuery plugin to perform auto-sizing of textarea elements as the user types, the goal being that the textarea is always tall enough to display all of the text without scrolling. Unlike other libraries that are all clever and predict how much space the text is going to take up so they can keep the textarea sized correctly, this plugin is entirely un-clever and cheats off of the browser's homework.

The basic approach is to create an invisible absolutely positioned div that mirrors all the relevant css attributes of the textarea, including the width, populate it with the text in the textarea, allow the browser to size the div itself, and the propagate the height back to the textarea.

This sometimes requires management from the application code, because if the textarea is styled such that changes to the DOM can change its width without changing its contents, the plugin will need to be informed by the application in order to update the height of the textarea.

### Basic Usage
When a textarea is added to the DOM, this call will size it to the text it contains, and monitor it for textchanges, automatically resizing it when they occur:

<pre>$(textarea).yaar()</pre>

An options object can be passed the first time .yaar() is called on a textarea. The following options are supported:
* textPadding - a string that is used to pad the text in the textarea. The textarea will always be kept big enough to display the actual text it contains, plus this text appended to the end. This allows the textarea to grow by a line just before it needs to, rather than just after. The default is 'W'.
* minLines - the minimum number of lines that the textarea is allowed to be sized to. The default is 1.

When the DOM is modified in a way that changes the layout of the textarea without changing its text contents, this same method will force the textarea to resize to fit the contents:

<pre>$(textarea).yaar()</pre>

If for some reason you want to keep the textarea in the DOM, but stop it from autosizing, this call will uninitialize everything:

<pre>$(textarea).yaar("destroy")</pre>

### Dependencies
Stricly speaking, YAAR does not have any dependencies other than jQuery itself, however to function correctly it needs to know when the text in the target textarea changes. The simplest way to achieve this is to include jquery.textchange (http://www.zurb.com/playground/jquery-text-change-custom-event), and YAAR will automatically receive the text change events. Any library or custom application code that dispatches a 'textchange' event on the textarea, or custom application code that refreshes YAAR (see API below) when its contents change will do the job.

### Release History
* 1.0 - initial release (5/14/2012)

### License
 This is plugin is provided as-is with no copyright, licensing, substitutions, exchanges or refunds. If you have a problem with that, you can talk to my lawyer Mr. Lionel Hutz.
