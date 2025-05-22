const { LicenseWebpackPlugin } = require('license-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // css 별도 추출 플러그인
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts"); // 비어있는 파일 삭제 플러그인
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // css 파일 최적화 플러그인
const TerserPlugin = require('terser-webpack-plugin'); // js 파일 최적화 및 압축 플러그인
const path = require("path");

module.exports = {
    target: "web",
    context: __dirname, // 현재 디렉토리 기준으로 경로 설정
    entry: {
        main: "./src/ts/index.ts", // JS or TS 엔트리 포인트
        styles: [ // css 엔트리 포인트 번들
            "./src/css/index.css",
            "./src/css/reset.css"
        ]
    },
    resolve: { // D3 같은 모듈 임포트 시에 파일 확장자 생략 시 ts와 js 순으로 파일 찾게 설정
        extensions: [".ts", ".js"],
        mainFields: ["browser", "module", "main"]
    },
    module: {
        rules: [
        // {
        //         test: /\.m?js$/,
        //         include: /node_modules/,
        //         type: 'javascript/auto'
        // },
        {
            test: /\.ts$/,
            use: "ts-loader",
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: [
                { // 로더 체인
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "./css/"
                    }
                },
                "css-loader" // 컴파일 방식
            ]
        },
        {
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset',
            parser: {
              dataUrlCondition: { maxSize: 10 * 1024 } // 10KB 이하 인라인
            },
            generator: {
                filename: './[name].[contenthash][ext]'
            }
        }
        ]
    },
    // mode: "development", // 개발 시
    // devtool: "eval-source-map", // 개발 시 매핑 정보 파일 안에 생성.
    mode: "production", // 배포 시 파일 용량까지 줄여줌
    devtool: "source-map", // 배포시 파일 바깥에 매핑 정보 생성.
    optimization: { // 최적화 관련
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false, // 모든 주석 제거
                    },
                },
            }),
            new CssMinimizerPlugin()
        ],
        // splitChunks: { // 모든 엔트리와 청크에 대해 공통 모듈 자동 분리 후 별도의 청크로 생성. 캐싱 효율 증가.
        //     chunks: 'all',
        // },
        minimize: true
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({ // JS는 output에서 다루고 css는 별도로 다루기 위해 플러그인 도입
            filename: "../css/[name].css"
        }),
        new LicenseWebpackPlugin({
            outputFilename: '../THIRD-PARTY-LICENSES.txt',
            // 프로젝트 전체 패키지 하나로 통합
            perChunkOutput: false,
            // import로 할당하지 않은 라이브러리 스캔
            // additionalModules: [
            //     {
            //         name: 'd3',
            //         directory: path.resolve(__dirname, 'node_modules', 'd3')
            //     }
            // ],
            addBanner: true,
            banner: 'Third-Party Licenses\nSee below for full license texts.\n'
        }),
    ],
    output: {
        filename: "[name].js",
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, "dist/js"),
        clean: true, // 빌드 전에 출력 폴더 정리
        iife: true,
        publicPath: '/dist/js/' // 웹 서버에서 asset 참조할 기본 URL 경로 설정.
    }
};