import * as path from 'path'
import { fileURLToPath } from 'url';
import * as webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pathSrc = path.resolve(__dirname, 'src')
const pathBuild = path.resolve(__dirname, 'dist')
const pathTemplateAssets = path.resolve(__dirname, 'wp-content', 'themes', 'worstpractice', 'assets')

const config: webpack.Configuration[] = [
    {
        entry: pathSrc + '/script/index.ts',
        output: {
            path: pathTemplateAssets + '/js',
            filename: 'bundle.min.js',
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                    }
                }
            ],
        },
        devtool: false,
        resolve: {
            extensions: ['.ts', '.js'],
        }
    },
    {
        entry: pathSrc + '/style/index.scss',
        output: {
            path: pathBuild,
            filename: 'bundle.style.js'
        },
        module: {
            rules: [
                {
                    test: /\.s[ca]ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {loader: 'css-loader', options: {importLoaders: 2, sourceMap: false}},
                        {loader: 'postcss-loader', options: {sourceMap: true}},
                        {loader: 'sass-loader', options: {sourceMap: true}},
                    ]
                }
            ],
        },
        devtool: false,
        resolve: {
            extensions: ['.css', '.scss', '.sass'],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '../wp-content/themes/worstpractice/assets/css/bundle.min.css'
            })
        ]
    }
]

export default config