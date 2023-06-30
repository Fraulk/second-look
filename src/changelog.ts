export interface IChangelog {
    content: string,
    date: Date,
}

export const changelog: IChangelog[] = [
    {
        date: new Date("2023-06-30"),
        content: `# Bugfix
        Fixed clicking a link and get all shots marked as seen when the "Mark all shot as seen at close" setting was checked  
        (More like a workaround actually, if you get weird behavior like a popup not opening/closing contact me)
        `
    },
    {
        date: new Date("2023-06-26"),
        content: `# Changelog
        Added this changelog modal so that every new stuff I code into the site gets written somewhere
        `
    },
    {
        date: new Date("2023-06-10"),
        content: `# New setting
        Added a new setting:
        <ul>
        - Mark all shot as seen at close
        </ul>
        Disabled by default  
        Instead of clicking on the "Mark as seen" button, this setting will automatically mark all the shots as seen when you close the tab/browser.  
        ~Currently, clicking on a shot counts as leaving the website so it activates this feature, I'll fix that one day~
        `
    },
    {
        date: new Date("2023-06-02"),
        content: `# New settings
        Added two new settings:
        <ul>
        - Grid size
        - HUD opacity
        </ul>
        If by accident you set the opacity too low and now can't find it back and reset it, you can press F12, go in "Application", in Locale Storage and delete the "settings" object
        `
    },
]