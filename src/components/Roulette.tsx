import { useEffect, useState } from 'react';
import './Roulette.css';
import { css } from '@emotion/css';
import { RouletteConfig } from '../models/RouletteConfig';
import { getRouletteConfig } from '../services/RouletteService';

const ROULETTE_SIZE: string = '500px';

function Roulette() {
    const [rouletteConfig, setRouletteConfig] = useState<RouletteConfig>({
        items: [],
        colors: [],
    });
    const [rouletteTransform, setRouletteTransform] = useState<string>();
    const [currentAngle, setCurrentAngle] = useState<number>(0);
    const [result, setResult] = useState<string>('Spin the wheel !');

    useEffect(() => {
        async function fetchRouletteConfig() {
            setRouletteConfig(await getRouletteConfig());
        }

        fetchRouletteConfig();
    }, []);

    const spin = (): void => {
        const totalProbability = rouletteConfig.items.reduce(
            (acc, item) => acc + item.probability,
            0
        );
        const random = Math.random() * totalProbability;
        let sum = 0;
        let selectedItemIndex = 0;

        for (let i = 0; i < rouletteConfig.items.length; i++) {
            sum += rouletteConfig.items[i].probability;
            if (random <= sum) {
                selectedItemIndex = i;
                break;
            }
        }

        setResult(`Result : ${rouletteConfig.items[selectedItemIndex].name}`);

        const rotations = 3; // Number of full rotations before landing on the item
        const sliceAngle = 360 / rouletteConfig.items.length;
        const degrees = rotations * 360 + selectedItemIndex * sliceAngle;

        setRouletteTransform(`rotate(-${currentAngle + degrees}deg)`);

        setCurrentAngle(currentAngle + degrees - selectedItemIndex * sliceAngle);
    };

    const RouletteItems = (): React.JSX.Element[] => {
        const items: React.JSX.Element[] = [];

        rouletteConfig.items.forEach((item, index) => {
            items.push(
                <li
                    key={index}
                    className={
                        'roulette-item ' +
                        getRouletteItemStyle(rouletteConfig, index)
                    }
                    style={{
                        transform: `rotate(calc(360deg / ${rouletteConfig.items.length} * ${index}))`,
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
            <div className="roulette-container">
                <div className="roulette-title">{result}</div>

                <div className={'roulette ' + rouletteStyle}>
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

const rouletteStyle = css`
    width: ${ROULETTE_SIZE};
    height: ${ROULETTE_SIZE};
`;

const getRouletteItemStyle = (
    config: RouletteConfig,
    index: number
): string => {
    const angle: number = 3.1416 / config.items.length;
    const tangentFirst: number = angle;
    const tangentSecond: number = (1 / 3) * angle * angle * angle;
    const tangentThird: number =
        (2 / 15) * angle * angle * angle * angle * angle;
    const tangentFourth: number =
        (17 / 315) * angle * angle * angle * angle * angle * angle * angle;
    const tangent: number =
        tangentFirst + tangentSecond + tangentThird + tangentFourth;

    return css`
        bottom: calc(${ROULETTE_SIZE} / 2);
        height: calc(${ROULETTE_SIZE} / 2.1);
        left: calc(${ROULETTE_SIZE} / 4);
        width: calc(${ROULETTE_SIZE} / 2);

        &:after {
            border-right: calc(${ROULETTE_SIZE} / 2 * ${tangent} + 1px) solid
                transparent !important;
            border-top: calc(${ROULETTE_SIZE} / 2) solid transparent !important;
            border-left: calc(${ROULETTE_SIZE} / 2 * ${tangent} + 1px) solid
                transparent !important;
            border-top-color: ${config.colors[index % 2 ? 0 : 1]} !important;
        }
    `;
};
