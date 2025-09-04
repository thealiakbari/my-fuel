import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	moduleFileExtensions: ['ts', 'js', 'json'],
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	// moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
	// 	prefix: '<rootDir>/',
	// }),
	moduleNameMapper: {
		'^@port/(.*)$': '<rootDir>/modules/pkg/infrastructure/port/$1',
		'^@infra$': '<rootDir>/modules/pkg/infrastructure',
		'^@infra/(.*)$': '<rootDir>/modules/pkg/infrastructure/$1',
		'^@app/(.*)$': '<rootDir>/modules/app/$1',
		'^@app$': '<rootDir>/modules/app',
		'^@business_flow$': '<rootDir>/modules/business_flow',
		'^@business_flow/(.*)$': '<rootDir>/modules/business_flow/$1',
	},
};
