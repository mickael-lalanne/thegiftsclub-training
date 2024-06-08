import { useEffect, useState } from 'react';
import './Roulette.css';
import { css } from '@emotion/css';

type RouletteItem = {
    id: number;
    name: string;
    probability: number;
};

const COLORS: string[] = ['#f59000', '#5e0cab'];

function Roulette() {
    const [rouletteItems, setRouletteItems] = useState<RouletteItem[]>([]);
    const [rouletteTransform, setRouletteTransform] = useState<string>();
    const [currentAngle, setCurrentAngle] = useState<number>(0);
    const [result, setResult] = useState<string>('Tournez la roue !');

    useEffect(() => {
        setRouletteItems([
            { id: 1, name: 'Item 1', probability: 0.2 },
            { id: 2, name: 'Item 2', probability: 0.2 },
            { id: 3, name: 'Item 3', probability: 0.2 },
            { id: 4, name: 'Item 4', probability: 0.2 },
            { id: 5, name: 'Item 5', probability: 0.2 },
            { id: 6, name: 'Item 6', probability: 0.2 },
        ]);
    }, []);

    const spin = (): void => {
        const totalProbability = rouletteItems.reduce(
            (acc, item) => acc + item.probability,
            0
        );
        const random = Math.random() * totalProbability;
        let sum = 0;
        let selectedItemIndex = 0;

        for (let i = 0; i < rouletteItems.length; i++) {
            sum += rouletteItems[i].probability;
            if (random <= sum) {
                selectedItemIndex = i;
                break;
            }
        }

        setResult(`Result : ${rouletteItems[selectedItemIndex].name}`);

        const rotations = 3; // Number of full rotations before landing on the item
        const sliceAngle = 360 / rouletteItems.length;
        const degrees = rotations * 360 + selectedItemIndex * sliceAngle;

        setRouletteTransform(`rotate(-${currentAngle + degrees}deg)`);

        setCurrentAngle(currentAngle + degrees);
    };

    const RouletteItems = (): React.JSX.Element[] => {
        const items: React.JSX.Element[] = [];

        rouletteItems.forEach((item, index) => {
            items.push(
                <li
                    key={item.id}
                    className={'roulette-item ' + css`
                        &:after {
                            border-top-color: ${COLORS[index % 2 ? 0 : 1]} !important;
                        }
                    `}
                    style={{
                        transform: `rotate(calc(360deg / ${rouletteItems.length} * ${index}))`,
                    }}
                >
                    {item.name}
                </li>
            );
        });
        return items;
    };

    return (
        <>
            <div className="compsoul-body">
                <div className="p-8">{result}</div>

                <div className="roulette">
                    <ul
                        className="roulette-list"
                        style={{ transform: rouletteTransform }}
                    >
                        {RouletteItems()}
                    </ul>
                    <div className="roulette-marker"></div>
                </div>
                <button onClick={spin}>Spin</button>
            </div>
        </>
    );
}

export default Roulette;
