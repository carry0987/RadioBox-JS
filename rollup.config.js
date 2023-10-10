import terser from "@rollup/plugin-terser";
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/radioBox.js',
    output: [
        {
            file: 'dist/radioBox.min.js',
            format: 'umd',
            name: 'RadioBox',
            plugins: [terser()],
        }
    ],
    plugins: [
        postcss({
            extract: true,
            minimize: true,
            sourceMap: false
        }),
    ]
};
