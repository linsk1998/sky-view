import {Div} from "../src/sky-view/component/html/Div"

test('hello world test', () => {
	var div=new Div();
	div.renderTo(document.body);
	expect(document.body.children.length).toBe(1);
});