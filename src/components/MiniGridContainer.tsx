import { ReactElement } from "react";

type Props = {
    displaySquares: NodeListOf<Element>;
};

const displayDivs: ReactElement[] = [];
for (let i = 0; i < 16; i++) {
    displayDivs.push(<div key={i + "-displayer"}></div>);
}
// let displaySquares: ;

const MiniGridContainer = ({ displaySquares }: Props) => {
    return <div className="mini-grid">{displayDivs}</div>;
};

export default MiniGridContainer;
