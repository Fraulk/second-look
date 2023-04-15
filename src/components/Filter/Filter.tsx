import { useKeyPress } from "../../utils/hooks"
import "./style.scss"
import { useEffect, useRef, useState } from 'react';

export const Filter = (props: {autocomplete: string[], onFilter: (props: any) => void}) => {
    const {autocomplete, onFilter} = props
    const input = useRef<HTMLInputElement>(null)
    let timer: any = undefined
    const [focusedIndex, setFocusedIndex] = useState(-1)

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

    const handleClearSearch = () => {
        input.current!.value = ""
        input.current!.focus()
        onFilter("")
    }

    useEffect(() => {
      setFocusedIndex(-1)
    }, [autocomplete])
    
    const goUpward = () => setFocusedIndex((prev) => (prev > 0) ? prev - 1 : autocomplete.length - 1)
    const goDownward = () => setFocusedIndex((prev) => (prev < autocomplete.length - 1) ? prev + 1 : 0)

    useKeyPress(['k'], "ctrlKey", () => input.current?.focus());
    useKeyPress(['Escape'], "", () => input.current?.blur());
    
    useKeyPress(['ArrowUp'], "", () => goUpward());
    useKeyPress(['Tab'], "shiftKey", () => goUpward());

    useKeyPress(['ArrowDown'], "", () => goDownward());
    useKeyPress(['Tab'], "", () => goDownward());

    useKeyPress(['Enter'], "", () => handleInputChange(autocomplete[focusedIndex] ?? ""));

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
                        <div className="autocomplete-list">
                            {autocomplete && autocomplete.map((item, i) => (
                                <div className={`autocomplete-element${focusedIndex == i ? " hasFocus" : ""}`} onClick={() => handleInputChange(item)} key={i}>{item}</div>
                            ))}
                        </div>
                        <div className="navigation-keys">
                            <div className="separator"></div>
                            <div className="navigation-content">
                                <div className="navigation-left-content">
                                    <span className="key">↓</span> or
                                    <span className="key">Tab</span>
                                </div>
                                <div className="navigation-right-content">
                                    <span className="key">Shift</span> +
                                    <span className="key">Tab</span> or
                                    <span className="key">↑</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {input.current?.value && <div className="cross" onClick={handleClearSearch}>✕</div>}
            </div>
        </div>
    )
}