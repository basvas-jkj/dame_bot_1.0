const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports =
{
    devtool: "source-map",
    entry: ["./src/main.ts", "./src/style.css"],
    output:
    {
        path: path.resolve(__dirname, "dist"),
        filename: "script.js",
        assetModuleFilename: "svg/[name][ext]"
    },
    module:
    {
        rules:
        [
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.ts$/,
                loader: "ts-loader"
            },
            {
                test: /\.svg$/,
                type: "asset/resource"
            }
        ]
    },
    plugins:
    [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({filename: 'style.css'}),
        new HtmlWebpackPlugin({template: 'src/index.html'})
    ],
    resolve:
    {
        extensions: [".ts"]
    }
}