import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');

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
        replace({
            preventAssignment: true,
            __version__: pkg.version
        }),
        postcss({
            extract: true,
            minimize: true,
            sourceMap: false
        }),
    ]
};
