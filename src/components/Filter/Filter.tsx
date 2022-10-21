import { useKeyPress } from "../../utils/hooks"
import "./style.scss"
import { useRef } from 'react';

export const Filter = (props: {autocomplete: string[], onFilter: (props: any) => void}) => {
    const {autocomplete, onFilter} = props
    const input = useRef<HTMLInputElement>(null)
    let timer: any = undefined

    const handleFilter = (term: string) => {
        if (term.length <= 1) {
            clearTimeout(timer);
            timer = setTimeout(() => onFilter(""), 500);
            return
        }
        clearTimeout(timer);
        timer = setTimeout(() => onFilter(term), 500);
    }

    const handleInputChange = (newInput: string) => {
        input.current!.value = newInput
        input.current!.focus()
        onFilter(newInput)
    }

    // TODO: add a cross to remove text

    useKeyPress(['k'], "ctrlKey", () => input.current?.focus());
    useKeyPress(['Escape'], "", () => input.current?.blur());

    return (
        <div className="Filter">
            <div className="filter-bar" tabIndex={-1}>
                <input type="text" name="filter" id="filter" placeholder="Search for an author" onChange={(e) => handleFilter(e.target.value)} ref={input} />
                <div className="shortcuts">
                    <span className="key">Ctrl</span>
                    +
                    <span className="key">K</span>
                </div>
                {autocomplete.length > 0 && 
                    <div className="autocomplete-search">
                        {autocomplete && autocomplete.map((item, i) => (
                            <div className="autocomplete-element" onClick={() => handleInputChange(item)} key={i}>{item}</div>
                        ))}
                    </div>
                    }
            </div>
        </div>
    )
}