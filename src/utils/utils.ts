export const parseMarkdown = (content: string) => {
    const toHTML = content
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')    // h3 tag
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')     // h2 tag
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')      // h1 tag
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')    // bold text
        .replace(/\*(.*)\*/gim, '<i>$1</i>')        // italic text
        .replace(/\- (.*)/gim, '<li>$1</li>')       // lists (without <ul>)
        .replace(/(.)  $/gim, '$1<br />')           // new line

    return toHTML.trim();
}