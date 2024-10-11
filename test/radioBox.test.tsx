import { RadioBox } from '@/index';
import { render, cleanup, fireEvent } from '@testing-library/preact';
import { JSX } from 'preact';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('RadioBox with Preact', () => {
    const setup = (htmlContent: JSX.Element, options = {}) => {
        const { container } = render(htmlContent);

        return new RadioBox(container.querySelectorAll('input'), options);
    };

    afterEach(() => {
        cleanup();
    });

    it('should correctly render and initialize radio boxes', () => {
        const jsx = (
            <div>
                <input type="radio" name="radio-normal" value="Test-1" />
                <input type="radio" name="radio-normal" value="Test-2" checked={true} />
            </div>
        );

        const radioBox = setup(jsx);

        const { container } = render(
            <div>
                {radioBox.elements.map((el, idx) => (
                    <input type="radio" checked={el.checked} key={idx} value={el.value}></input>
                ))}
            </div>
        );

        const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        expect(radios).toHaveLength(2);
        expect(radios[0].checked).toBeFalsy();
        expect(radios[1].checked).toBeTruthy();
    });

    it('should update selection correctly when value changes', () => {
        const jsx = (
            <div>
                <input type="radio" name="radio-normal" value="Test-1" />
                <input type="radio" name="radio-normal" value="Test-2" checked />
            </div>
        );

        const radioBox = setup(jsx);

        const { container, rerender } = render(
            <div>
                {radioBox.elements.map((el, idx) => (
                    <input type="radio" checked={el.checked} key={idx} value={el.value}></input>
                ))}
            </div>
        );

        radioBox.value = 'Test-1';
        rerender(
            <div>
                {radioBox.elements.map((el, idx) => (
                    <input type="radio" checked={el.checked} key={idx} value={el.value}></input>
                ))}
            </div>
        );

        const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        expect(radios[0].checked).toBeTruthy();
        expect(radios[1].checked).toBeFalsy();
    });

    it('should update selection correctly when target clicked', () => {
        const onChangeMock = vi.fn();

        const jsx = (
            <div>
                <input type="radio" name="radio-normal" value="Test-1" />
                <input type="radio" name="radio-normal" value="Test-2" />
            </div>
        );

        const radioBox = setup(jsx, { onChange: onChangeMock });

        const { container } = render(
            <div>
                {radioBox.elements.map((el, idx) => (
                    <input type="radio" checked={el.checked} key={idx} value={el.value}></input>
                ))}
            </div>
        );

        const radio = container.querySelector<HTMLInputElement>('input[value="Test-1"]');
        if (radio) fireEvent.click(radio);

        const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        expect(radios[0].checked).toBeTruthy();
        expect(radios[1].checked).toBeFalsy();
    });
});
