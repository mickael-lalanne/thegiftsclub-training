import { useEffect, useState } from 'react';
import './Roulette.css';
import { css } from '@emotion/css';
import { RouletteConfig } from '../models/RouletteConfig';
import { getRouletteConfig } from '../services/RouletteService';

function Roulette() {
    const [rouletteConfig, setRouletteConfig] = useState<RouletteConfig>({
        items: [],
        colors: [],
    });
    const [rouletteTransform, setRouletteTransform] = useState<string>();
    const [currentAngle, setCurrentAngle] = useState<number>(0);
    const [result, setResult] = useState<string>('Tournez la roue !');

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

        setCurrentAngle(currentAngle + degrees);
    };

    const RouletteItems = (): React.JSX.Element[] => {
        const items: React.JSX.Element[] = [];

        rouletteConfig.items.forEach((item, index) => {
            items.push(
                <li
                    key={index}
                    className={
                        'roulette-item ' +
                        css`
                            &:after {
                                border-top-color: ${rouletteConfig.colors[index % 2 ? 0 : 1]} !important;
                            }
                        `
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
