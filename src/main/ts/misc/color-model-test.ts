import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import * as ColorModel from './color-model';
import {ColorComponents3} from './color-model';

const DELTA = 2;

describe('ColorModel', () => {
	const testCases = [
		{
			hsl: {h: 0, s: 0, l: 0},
			hsv: {h: 0, s: 0, v: 0},
			rgb: {r: 0, g: 0, b: 0},
		},
		{
			hsl: {h: 0, s: 0, l: 100},
			hsv: {h: 0, s: 0, v: 100},
			rgb: {r: 255, g: 255, b: 255},
		},
		{
			hsl: {h: 0, s: 100, l: 50},
			hsv: {h: 0, s: 100, v: 100},
			rgb: {r: 255, g: 0, b: 0},
		},
		{
			hsl: {h: 70, s: 32, l: 63},
			hsv: {h: 70, s: 32, v: 75},
			rgb: {r: 180, g: 190, b: 130},
		},
		{
			hsl: {h: 174, s: 71, l: 56},
			hsv: {h: 174, s: 71, v: 88},
			rgb: {r: 64, g: 224, b: 208},
		},
		{
			hsl: {h: 208, s: 100, l: 50},
			hsv: {h: 208, s: 100, v: 100},
			rgb: {r: 0, g: 136, b: 255},
		},
		{
			hsl: {h: 229, s: 20, l: 11},
			hsv: {h: 229, s: 33, v: 13},
			rgb: {r: 22, g: 24, b: 33},
		},
		{
			hsl: {h: 255, s: 32, l: 68},
			hsv: {h: 255, s: 26, v: 78},
			rgb: {r: 160, g: 147, b: 199},
		},
		{
			hsl: {h: 317, s: 38, l: 48},
			hsv: {h: 317, s: 55, v: 67},
			rgb: {r: 170, g: 76, b: 143},
		},
	];
	testCases.forEach(({rgb, hsl, hsv}) => {
		context(`when ${JSON.stringify(rgb)}`, () => {
			it(`it should convert to ${JSON.stringify(hsl)}`, () => {
				const actual = ColorModel.convertMode(
					[rgb.r, rgb.g, rgb.b],
					'rgb',
					'hsl',
				);
				assert.closeTo(actual[0], hsl.h, DELTA);
				assert.closeTo(actual[1], hsl.s, DELTA);
				assert.closeTo(actual[2], hsl.l, DELTA);
			});
			it(`it should convert to ${JSON.stringify(hsv)}`, () => {
				const actual = ColorModel.convertMode(
					[rgb.r, rgb.g, rgb.b],
					'rgb',
					'hsv',
				);
				assert.closeTo(actual[0], hsv.h, DELTA);
				assert.closeTo(actual[1], hsv.s, DELTA);
				assert.closeTo(actual[2], hsv.v, DELTA);
			});
		});
	});
	testCases.forEach(({rgb, hsl}) => {
		context(`when ${JSON.stringify(hsl)}`, () => {
			it(`it should convert to ${JSON.stringify(rgb)}`, () => {
				const actual = ColorModel.convertMode(
					[hsl.h, hsl.s, hsl.l],
					'hsl',
					'rgb',
				);
				assert.closeTo(actual[0], rgb.r, DELTA);
				assert.closeTo(actual[1], rgb.g, DELTA);
				assert.closeTo(actual[2], rgb.b, DELTA);
			});
		});
	});
	testCases.forEach(({rgb, hsv}) => {
		context(`when ${JSON.stringify(hsv)}`, () => {
			it(`it should convert to ${JSON.stringify(rgb)}`, () => {
				const actual = ColorModel.convertMode(
					[hsv.h, hsv.s, hsv.v],
					'hsv',
					'rgb',
				);
				assert.closeTo(actual[0], rgb.r, DELTA);
				assert.closeTo(actual[1], rgb.g, DELTA);
				assert.closeTo(actual[2], rgb.b, DELTA);
			});
		});
	});
	testCases.forEach(({hsl, hsv}) => {
		context(`when ${JSON.stringify(hsl)}`, () => {
			it(`it should convert to ${JSON.stringify(hsv)}`, () => {
				const actual = ColorModel.convertMode(
					[hsl.h, hsl.s, hsl.l],
					'hsl',
					'hsv',
				);
				assert.closeTo(actual[0], hsv.h, DELTA);
				assert.closeTo(actual[1], hsv.s, DELTA);
				assert.closeTo(actual[2], hsv.v, DELTA);
			});
		});
	});
	testCases.forEach(({hsl, hsv}) => {
		context(`when ${JSON.stringify(hsv)}`, () => {
			it(`it should convert to ${JSON.stringify(hsl)}`, () => {
				const actual = ColorModel.convertMode(
					[hsv.h, hsv.s, hsv.v],
					'hsv',
					'hsl',
				);
				assert.closeTo(actual[0], hsl.h, DELTA);
				assert.closeTo(actual[1], hsl.s, DELTA);
				assert.closeTo(actual[2], hsl.l, DELTA);
			});
		});
	});

	[
		[0, 0, 0],
		[0, 127, 255],
		[11, 22, 33],
	].forEach((comps: ColorComponents3) => {
		context(`when ${JSON.stringify(comps)}`, () => {
			it('it should make opaque', () => {
				assert.deepEqual(ColorModel.opaque(comps), [...comps, 1]);
			});
		});
	});
});
