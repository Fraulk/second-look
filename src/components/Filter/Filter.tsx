import { useKeyPress } from "../../utils/hooks"
import "./style.scss"
import { useRef } from 'react';

export const Filter = (props: {autocomplete: string[], onFilter: (props: any) => void}) => {
    const {autocomplete, onFilter} = props
    const input = useRef<HTMLInputElement>(null)

    const handleFilter = (term: string) => {
        if (term.length <= 2) return onFilter("")
        onFilter(term)
    }

    // TODO: make autocomplete clickable, and use with arrows
    // TODO: remove "load more" button on search
    // TODO: add a cross to remove text

    useKeyPress(['k'], "ctrlKey", () => input.current?.focus());
    useKeyPress(['Escape'], "", () => input.current?.blur());

    return (
        <div className="Filter">
            <div className="filter-bar">
                <input type="text" name="filter" id="filter" placeholder="Search for an author" onChange={(e) => handleFilter(e.target.value)} ref={input} />
                <div className="shortcuts">
                    <span className="key">Ctrl</span>
                    +
                    <span className="key">K</span>
                </div>
                {autocomplete.length > 0 && 
                    <div className="autocomplete-search">
                        {autocomplete && autocomplete.map((item, i) => (
                            <div className="autocomplete-element" key={i}>{item}</div>
                        ))}
                    </div>
                    }
            </div>
        </div>
    )
}