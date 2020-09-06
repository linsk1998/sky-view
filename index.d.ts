declare module "sky-view/render/Component" {
    export interface Component {
        renderTo(parent: Node): void;
        destroy(): void;
        on(name: string, callback: Function, thisArg?: any): void;
        off(name: string, callback: Function): void;
        emit(name: string, ...args: any[]): void;
    }
}
declare module "sky-view/render/ComponentConstructor" {
    import { Tag } from "sky-view/render/Tag";
    import { Component } from "sky-view/render/Component";
    export interface ComponentConstructor {
        new (props: any, children?: Tag[]): Component;
    }
}
declare module "sky-view/render/Tag" {
    import { ComponentConstructor } from "sky-view/render/ComponentConstructor";
    export class Tag {
        component: ComponentConstructor;
        children: Tag[];
        props: any;
    }
}
declare module "sky-view/render" {
    import { Tag } from "sky-view/render/Tag";
    export function render(tag: Tag, parent: Node): void;
}
declare module "sky-view/list" {
    export interface LinekedListItem {
        next?: this;
        prev?: this;
        list?: LinekedList;
    }
    export class LinekedList<T extends LinekedListItem = LinekedListItem> {
        head: T;
        tail: T;
        length: number;
        constructor();
        /**
         * 从尾部添加
         */
        push(item: T): T;
        /**
         * 从头部添加
         */
        unshift(item: T): void;
        /**
         * 从尾部删除
         */
        pop(): void;
        /**
         * 从头部删除
         */
        shift(): void;
        /**
         * 删除指定元素
         */
        remove(item: T): void;
        /**
         * 在一个元素前面插入
         * @param newItem 新插入的元素
         * @param existingItem 原本存在的元素
         */
        insertBefore(newItem: T, existingItem: T): void;
        /**
         * 在一个元素后面插入
         * @param newItem 新插入的元素
         * @param existingItem 原本存在的元素
         */
        insertAfter(newItem: T, existingItem: T): void;
        /**
         * 遍历执行
         */
        forEach(callback: (currentValue: T, index: number, list: this) => void, thisArg?: object): boolean;
        /**
         * 用来判断是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。
         * @param item 链表中，或链表外的一项
         */
        includes(item: T): boolean;
        /**
         * 获取列表中满足提供的测试函数的第一个元素的值。
         * @param callback 在数组每一项上执行的函数
         * @param thisArg 执行回调时用作this 的对象
         */
        find(callback: (currentValue: T, index: number, list: this) => boolean, thisArg?: object): T;
        /**
         * 测试数组中是不是至少有1个元素通过了被提供的函数测试。
         * @param callback 在数组每一项上执行的函数
         * @param thisArg 执行回调时用作this 的对象
         */
        some(callback: (currentValue: T, index: number, list: this) => boolean, thisArg?: object): boolean;
        /**
         * 测试一个数组内的所有元素是否都能通过某个指定函数的测试。
         * @param callback 在数组每一项上执行的函数
         * @param thisArg 执行回调时用作this 的对象
         */
        every(callback: (currentValue: T, index: number, list: this) => boolean, thisArg?: object): boolean;
        /**
         * 过滤内容, 通过所提供函数实现的测试的所有元素。
         * @param callback 在数组每一项上执行的函数
         * @param thisArg 执行回调时用作this 的对象
         */
        filter(callback: (currentValue: T, index: number, list: this) => boolean, thisArg?: object): void;
    }
}
declare module "sky-view/events" {
    import { LinekedList, LinekedListItem } from "sky-view/list";
    export interface Event extends LinekedListItem {
        name: string;
        action: Function;
        thisArg: any;
    }
    export class EventEmitter extends LinekedList<Event> {
        on(name: string, action: Function, thisArg?: any): Event;
        off(name?: string, action?: Function): void;
        /**
         * @description 发射事件
         * @param name 事件名
         * @param args 参数
         * @returns 如果执行完成返回true，如果中断返回false
         */
        emit(name?: string, ...args: any[]): boolean;
    }
}
declare module "sky-view/reactive/object" {
    import { EventEmitter, Event } from "sky-view/events";
    import { LinekedList, LinekedListItem } from "sky-view/list";
    export const KEY_OBSERVABLE = "@@observable";
    export function observable(prototype: any, prop: string): void;
    export const KEY_COMPUTED = "@@computed";
    export function computed(prototype: any, prop: string): void;
    export const KEY_DIRECT = "@@direct";
    export function direct(prototype: any, prop: string): void;
    export const KEY_ACTION = "@@action";
    export function action(prototype: any, prop: string): void;
    const KEY_OPTIONS: unique symbol;
    type Action = (key: string, value: any) => void;
    interface ObservableObject {
        [KEY_OPTIONS]: ObservableObjectOptions;
    }
    interface ObservableObjectOptions {
        owners: LinekedList<Owner>;
        proxy: any;
        target: any;
        actionDeep: number;
        unemitedActions: Set<string>;
        computedDeps?: Record<string, Set<string>>;
        computedOnWatchs?: Set<string>;
        afterSetEmitter: EventEmitter;
        beforeGetEmitter: EventEmitter;
    }
    interface Owner extends LinekedListItem {
        key: string;
        object: ObservableObject;
    }
    export function isObservableObject(obj: any): obj is ObservableObject;
    export function getOptions(obj: any): ObservableObjectOptions;
    /**
     * 对象属性监听
     */
    export function onAfterSet(obj: any, key: string, action: Action): Event;
    export function removeAfterSet(obj: any, event: Event): void;
    /**
     * 取消对象属性监听
     */
    export function offAfterSet(obj: any, key: string, action: Function): void;
    export function emitAfterSet(obj: any, key: string, value: any): void;
    /**
     * 初始化
    */
    export function init(obj: any, target: any, Class: any): obj is ObservableObject;
    export function emitAfterSetOwn(obj: any): void;
    export function get(obj: any, key: string): any;
    export function set(obj: any, key: string, value: any): void;
    export function getObservable(obj: any, key: string): any;
    export function setObservable(obj: any, key: string, value: any): void;
    export function getComputed(obj: any, key: string): any;
    export function setComputed(obj: any, key: string, value: any): void;
    export function doAction(obj: any, fn: Function, args: ArrayLike<any>): any;
    export function startCollectDeps(options: ObservableObjectOptions, prop: string): void;
    export function endCollectDeps(options: ObservableObjectOptions, prop: string): void;
}
declare module "sky-view/dom/ClassList" {
    export class ClassList {
        protected el: Element;
        protected items: string[];
        length: number;
        value: string;
        constructor(el: Element);
        item(index: number): string;
        contains(token: string): boolean;
        add(...values: string[]): void;
        protected addOne(token: string): void;
        remove(...tokens: string[]): void;
        protected removeOne(token: string): void;
        replace(oldToken: string, newToken: string): void;
        toggle(token: string, force?: boolean): boolean;
        forEach(callback: (value: string, index: number, array: this) => void, thisArg?: any): void;
        toString(): string;
        reset(className: string): void;
    }
}
declare module "sky-view/dom/event" {
    /**
     * @description 根据传入事件，得到代替监听DOM的事件
     * @example 传入input可以得到propertychange；传入mouseenter可以得到mouseover 等
     */
    export var watcher: Record<string, string>;
    /**
     * @description 根据真实监听到DOM事件，得到标准事件
     * @example 传入propertychange可以得到input；传入mouseover可以得到mouseenter 等
     */
    export var proxy: Record<string, (e: Event) => string | void>;
    export function fixEvent(e: any): Event;
}
declare module "sky-view/component/attributes" {
    type Booleanish = boolean | 'false' | 'true';
    type Align = "left" | "right" | "center";
    export interface ElementAttributes {
        tagName?: string;
        class?: string;
        className?: string;
        classList?: Array<string>;
        id?: string;
        itemProp?: string;
        itemScope?: boolean;
        itemType?: string;
        itemID?: string;
        itemRef?: string;
        slot?: string;
        unselectable?: 'on' | 'off';
    }
    export interface HTMLAttributes extends ElementAttributes {
        contentEditable?: Booleanish;
        dir?: string;
        hidden?: boolean;
        lang?: string;
        tabIndex?: number;
        title?: string;
        translate?: 'yes' | 'no';
        role?: string;
    }
    export interface DivAttributes extends ElementAttributes {
        align?: Align;
    }
    interface LinkAttributes extends ElementAttributes {
        href?: string;
        hrefLang?: string;
        media?: string;
        ping?: string;
        rel?: 'alternate' | 'stylesheet' | 'start' | 'next' | 'prev' | 'contents' | 'index' | 'glossary' | 'copyright' | 'chapter' | 'section' | 'subsection' | 'appendix' | 'help' | 'bookmark' | 'nofollow' | 'noopener' | 'noreferrer' | 'licence' | 'tag' | 'friend' | string;
        shape?: 'default' | 'rect' | 'circle' | 'poly';
        target?: '_blank' | '_self' | '_top' | '_parent' | string;
        type?: "text/html" | string;
    }
    export interface AnchorAttributes extends LinkAttributes {
        download?: any;
    }
    export interface AreaAttributes extends LinkAttributes {
        alt?: string;
        coords?: string;
    }
    export interface MapAttributes extends HTMLAttributes {
        name?: string;
    }
    interface MediaAttributes extends HTMLAttributes {
        autoPlay?: boolean;
        controls?: boolean;
        controlsList?: 'nodownload' | 'nofullscreen' | 'noremoteplayback' | string;
        crossOrigin?: "anonymous" | "use-credentials";
        loop?: boolean;
        muted?: boolean;
        playsInline?: boolean;
        preload?: 'auto' | 'metadata' | 'none';
        src?: string;
    }
    export interface AudioAttributes extends MediaAttributes {
    }
    export interface VideoAttributes extends MediaAttributes {
        poster?: string;
        height?: number | string;
        width?: number | string;
        disablePictureInPicture?: boolean;
    }
    export interface SourceAttributes {
        media?: string;
        sizes?: string;
        src?: string;
        srcSet?: string;
        type?: string;
    }
    export interface TrackAttributes {
        default?: boolean;
        kind?: string;
        label?: string;
        src?: string;
        srcLang?: string;
    }
    export interface BGSoundAttributes {
        autoStart?: Booleanish;
        loop?: boolean;
    }
    interface ControlAttributes extends HTMLAttributes {
        accessKey?: string;
        autoFocus?: boolean;
        form?: string;
        disabled?: boolean;
        name?: string;
        value?: string | ReadonlyArray<string> | number;
    }
    export interface ListBoxAttributes extends SelectAttributes {
        multiple?: true;
    }
    export interface ComboBoxAttributes extends SelectAttributes {
        multiple?: false;
    }
    export interface SelectAttributes extends ControlAttributes {
        autoComplete?: string;
        multiple?: boolean;
        placeholder?: string;
        required?: boolean;
        size?: number;
    }
    export interface OptgroupAttributes {
        disabled?: boolean;
        label?: string;
    }
    export interface OptionAttributes {
        disabled?: boolean;
        label?: string;
        selected?: boolean;
        value?: string | ReadonlyArray<string> | number;
    }
    export interface TextInputAttributes extends ControlAttributes {
        autoComplete?: string;
        placeholder?: string;
        inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
        enterkeyhint?: 'enter' | 'go' | 'next' | 'previous' | 'search' | 'send';
        maxLength?: number;
        minLength?: number;
        pattern?: string;
        readOnly?: boolean;
        required?: boolean;
        size?: number;
    }
    export interface TextareaAttributes extends TextInputAttributes {
        cols?: number;
        colSpan?: number;
        rows?: number;
        wrap?: 'soft' | 'hard';
    }
    export interface TextBoxAttributes extends TextInputAttributes {
        list?: string;
    }
    export interface FileInputAttributes extends ControlAttributes {
        type?: "file";
        accept?: 'image/*' | 'image/png,image/jpeg,image/gif' | 'video/*' | 'audio/*' | string;
        capture?: 'user' | 'environment';
        multiple?: boolean;
        required?: boolean;
    }
    export interface NumberInputAttribute extends ControlAttributes {
        max?: number | string;
        min?: number | string;
        placeholder?: string;
        required?: boolean;
        step?: number | string;
    }
    export interface CheckBoxAttributes extends ControlAttributes {
        checked?: boolean;
    }
    export type RadioAttributes = CheckBoxAttributes;
    export interface ButtonAttributes extends ControlAttributes {
        type: "button" | "submit" | "reset";
        value?: string | ReadonlyArray<string> | number;
    }
    export interface SubmitImageAttributes extends ImageAttributes {
        type: "image";
    }
    export interface SubmitAttributes extends ButtonAttributes {
        type: "submit";
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
    }
    export type InputAttributes = TextInputAttributes | FileInputAttributes | CheckBoxAttributes | ButtonAttributes;
    export interface IFrameAttributes extends HTMLAttributes {
        allow?: string;
        allowFullScreen?: boolean;
        allowTransparency?: boolean;
        frameBorder?: number | string;
        height?: number | string;
        loading?: "eager" | "lazy";
        marginHeight?: number;
        marginWidth?: number;
        name?: string;
        sandbox?: string;
        scrolling?: 'yes' | 'no' | string;
        seamless?: boolean;
        src?: string;
        srcDoc?: string;
        width?: number | string;
    }
    export interface FormAttributes extends HTMLAttributes {
        acceptCharset: "UTF-8" | "ISO-8859-1" | string;
        action?: string;
        autoComplete?: string;
        encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
        method?: "GET" | "POST";
        name?: string;
        noValidate?: boolean;
        target?: '_blank' | '_self' | '_top' | '_parent' | string;
    }
    export interface FieldsetAttributes extends HTMLAttributes {
        disabled?: boolean;
        form?: string;
        name?: string;
    }
    export interface LabelAttribute extends HTMLAttributes {
        form?: string;
        for: string;
    }
    export interface ImageAttributes extends HTMLAttributes {
        alt?: string;
        border?: number | string;
        crossOrigin?: "anonymous" | "use-credentials";
        decoding?: 'sync' | 'async' | 'auto';
        height?: number | string;
        loading?: "eager" | "lazy";
        isMap?: boolean;
        sizes?: string;
        src?: string;
        srcSet?: string;
        useMap?: string;
        width?: number | string;
    }
    export interface TableAttributes extends HTMLAttributes {
        background?: string;
        bgcolor?: string;
        cellPadding?: number | string;
        cellSpacing?: number | string;
        summary?: string;
    }
    export interface TDAttributes extends HTMLAttributes {
        align?: "left" | "center" | "right" | "justify" | "char";
        colSpan?: number;
        headers?: string;
        rowSpan?: number;
    }
    export interface THAttributes extends TDAttributes {
        scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
    }
    export interface ColGroupAttributes extends HTMLAttributes {
        bgcolor?: string;
        span?: number;
    }
    export interface ColAttributes extends HTMLAttributes {
        bgcolor?: string;
        span?: number;
        width?: number | string;
    }
    export interface TBodyAttributes extends HTMLAttributes {
        bgcolor?: string;
    }
    export interface TFootAttributes extends HTMLAttributes {
        bgcolor?: string;
    }
    export interface TRAttributes extends HTMLAttributes {
        bgcolor?: string;
    }
    export interface HRAttributes extends HTMLAttributes {
        color?: string;
    }
    export interface OLAttribute extends HTMLAttributes {
        reversed?: boolean;
        start?: number;
        type?: '1' | 'a' | 'A' | 'i' | 'I';
    }
    export interface LiAttributes extends HTMLAttributes {
        value?: number;
    }
    export interface DialogAttributes extends HTMLAttributes {
        open?: boolean;
    }
    export interface CanvasAttributes extends HTMLAttributes {
        height?: number | string;
        width?: number | string;
    }
    export interface MeterAttribute extends HTMLAttributes {
        high?: number;
        low?: number;
        max?: number | string;
        min?: number | string;
        optimum?: number;
        value?: string | ReadonlyArray<string> | number;
    }
    export interface ProgressAttribute extends HTMLAttributes {
        max?: number | string;
        value?: string | ReadonlyArray<string> | number;
    }
    export interface MarqueeAttributes extends HTMLAttributes {
        bgcolor?: string;
        loop?: boolean;
    }
    export interface DetailsAttributes extends HTMLAttributes {
        open?: boolean;
    }
    export interface ObjectAttributes extends HTMLAttributes {
        classID?: string;
        data?: string;
        name?: string;
        height?: number | string;
        type?: string;
        useMap?: string;
        width?: number | string;
    }
    export interface ParamAttributes extends HTMLAttributes {
        name?: string;
        value?: string | ReadonlyArray<string> | number;
    }
    export interface EmbedAttributes extends HTMLAttributes {
        height?: number | string;
        src?: string;
        type?: "application/x-shockwave-flash" | "image/svg+xml" | "application/pdf" | "audio/mp3" | string;
        width?: number | string;
        wmode?: 'window' | 'opaque' | 'transparent' | string;
    }
    export interface BlockquoteAttributes extends HTMLAttributes {
        cite?: string;
    }
    export interface QAttributes extends HTMLAttributes {
        cite?: string;
    }
    export interface DelAttributes extends HTMLAttributes {
        cite?: string;
        dateTime?: string;
    }
    export interface InsAttributes extends HTMLAttributes {
        cite?: string;
        dateTime?: string;
    }
    export interface FontAttributes extends HTMLAttributes {
        color?: string;
    }
    export interface TimeAttributes extends HTMLAttributes {
        dateTime?: string;
        pubdate?: boolean;
    }
    export interface SlotAttributes {
        name?: string;
    }
}
declare module "sky-view/component/ElementComponent" {
    import { ClassList } from "sky-view/dom/ClassList";
    import { Component } from "sky-view/render/Component";
    import { EventEmitter } from "sky-view/events";
    import { Tag } from "sky-view/render/Tag";
    import { ElementAttributes } from "sky-view/component/attributes";
    export function initAttributesLowerCase(keys: string[], el: Element, attrs: Record<string, any>): void;
    export abstract class ElementComponent<T extends Element = Element> implements Component {
        protected _children: Component[];
        protected _parentNode: Node;
        el: T;
        get className(): string;
        set className(val: string);
        readonly classList: ClassList;
        readonly tagName: string;
        protected tags: Tag[];
        constructor(attrs: ElementAttributes, tags: Tag[]);
        /** 添加到文档上 */
        renderTo(parent: Node): void;
        /** 完成挂载生命周期钩子 */
        protected componentDidMount(): void;
        /** 添加元素 */
        appandChild(child: Component): void;
        /** 销毁 */
        destroy(): void;
        /** 将要移除生命周期钩子 */
        protected componentWillUnmount(): void;
        protected _eventEmitter: EventEmitter;
        protected _events?: Map<string, Function>;
        /** 添加事件绑定 */
        on(name: string, callback: Function, thisArg: any): void;
        off(name: string, callback: Function): void;
        emit(name: string, ...args: any[]): void;
        getAttribute(name: string): string;
        setAttribute(name: string, value: string): void;
    }
}
declare module "sky-view/component/HtmlComponent" {
    import { ElementComponent } from "sky-view/component/ElementComponent";
    import { Tag } from "sky-view/render/Tag";
    import { HTMLAttributes } from "sky-view/component/attributes";
    export class HtmlComponent<T extends HTMLElement = HTMLElement> extends ElementComponent<T> {
        protected props: HTMLAttributes;
        readonly tagName: string;
        constructor(attrs: HTMLAttributes, tags: Tag[]);
        get hidden(): boolean;
        set hidden(value: boolean);
    }
}
declare module "sky-view/component/html/Div" {
    import { HtmlComponent } from "sky-view/component/HtmlComponent";
    import { Tag } from "sky-view/render/Tag";
    import { DivAttributes } from "sky-view/component/attributes";
    export class Div extends HtmlComponent<HTMLDivElement> {
        constructor(props: DivAttributes, tags: Tag[]);
    }
}
declare module "sky-view/tags/core/Out" {
    import { Component } from "sky-view/render/Component";
    export interface TextProps {
        value: string;
    }
    export class Out implements Component {
        protected node: globalThis.Text;
        constructor(props: TextProps);
        renderTo(parent: Node): void;
        destroy(): void;
        setAttribute(key: string, value: string): void;
        getAttribute(key: string): string;
        get value(): string;
        set value(val: string);
        on(name: string, callback: Function, thisArg?: any): void;
        off(name: string, callback: Function): void;
        emit(name: string, ...args: any[]): void;
    }
}
declare module "sky-view/tag" {
    import { ComponentConstructor } from "sky-view/render/ComponentConstructor";
    import { Tag } from "sky-view/render/Tag";
    import { DivAttributes } from "sky-view/component/attributes";
    function tag(type: "div", props: DivAttributes, ...children: Child[]): Tag;
    function tag(type: string, props: Record<string, any>, ...children: Child[]): Tag;
    function tag(type: string | ComponentConstructor, props: any, ...children: Child[]): Tag;
    export { tag };
    export var typeMap: Map<string, ComponentConstructor>;
    type Child = Tag | string | number;
}
declare module "sky-view" {
    export { render } from "sky-view/render";
    export { tag } from "sky-view/tag";
}
declare module "compat/dom/event" {
    /**
     * @description 根据传入事件，得到代替监听DOM的事件
     * @example 传入input可以得到propertychange；传入mouseenter可以得到mouseover 等
     */
    export var watcher: Record<string, string>;
    /**
     * @description 根据真实监听到DOM事件，得到标准事件
     * @example 传入propertychange可以得到input；传入mouseover可以得到mouseenter 等
     */
    export var proxy: Record<string, (e: Event) => string | void>;
    export function fixEvent(e: any): Event;
}
declare module "modern/dom/event" {
    /**
     * @description 根据传入事件，得到代替监听DOM的事件
     * @example 传入input可以得到propertychange；传入mouseenter可以得到mouseover 等
     */
    export var watcher: Record<string, string>;
    /**
     * @description 根据真实监听到DOM事件，得到标准事件
     * @example 传入propertychange可以得到input；传入mouseover可以得到mouseenter 等
     */
    export var proxy: Record<string, (e: Event) => string | void>;
    export function fixEvent(e: any): Event;
}
declare module "sky-view/component/FragmentComponent" {
    import { Component } from "sky-view/render/Component";
    export abstract class FragmentComponent implements Component {
        renderTo(parent: Node): void;
        destroy(): void;
        on(name: string, callback: Function, thisArg?: any): void;
        off(name: string, callback: Function): void;
        emit(name: string, ...args: any[]): void;
    }
}
declare module "sky-view/component/html/Article" {
    import { ElementAttributes } from "sky-view/component/attributes";
    import { HtmlComponent } from "sky-view/component/HtmlComponent";
    import { Tag } from "sky-view/render/Tag";
    export class Article extends HtmlComponent<HTMLElement> {
        constructor(props: ElementAttributes, tags: Tag[]);
        get innerHTML(): string;
        set innerHTML(val: string);
    }
}
declare module "sky-view/component/html/Button" {
    import { HtmlComponent } from "sky-view/component/HtmlComponent";
    import { Tag } from "sky-view/render/Tag";
    import { ButtonAttributes } from "sky-view/component/attributes";
    export class Button extends HtmlComponent<HTMLButtonElement> {
        readonly type: string;
        constructor(props: ButtonAttributes, tags: Tag[]);
        get disabled(): boolean;
        set disabled(val: boolean);
    }
}
declare module "sky-view/reactive/array" {
    import { EventEmitter } from "sky-view/events";
    export class ObservableArray<T> {
        protected emiter: EventEmitter;
        on(name: string, action: Function, thisArg?: object): import("sky-view/events").Event;
        off(name: string, action: Function): void;
        protected array: T[];
        get length(): number;
        set length(value: number);
        get last(): T;
        get first(): T;
        add(index: number, item: T): void;
        addAll(index: number, items: T[]): void;
        get(index: number): T;
        set(index: number, item: T): void;
        remove(index: number): void;
        /**
         * 从尾部添加
         */
        push(): void;
        /**
         * 从头部添加
         */
        unshift(): void;
        /**
         * 从尾部删除
         */
        pop(): void;
        /**
         * 从头部删除
         */
        shift(): void;
        splice(index: number, deleteCount: number): void;
        splice(index: number, deleteCount: number, ...items: T[]): void;
        reverse(): void;
        sort(compareFn?: (a: T, b: T) => number): void;
        indexOf(item: T): number;
        lastIndexOf(item: T): number;
        find(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T;
        findIndex(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number;
        includes(item: T): boolean;
        slice(start: number, end: number): T[];
        toJson(): T[];
        map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        filter(callbackfn: (value: T, index: number, array: T[]) => value is T, thisArg?: any): T[];
        some(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
        every(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
        reduce(callbackfn: (previousValue: any, currentValue: T, currentIndex: number, array: T[]) => any, initialValue?: any): any;
        static from<T>(array: ArrayLike<T>): ObservableArray<unknown>;
    }
}
declare module "sky-view/reactive/observableFactory" {
    export function createObject<T extends Object>(target: object, Class: new () => T): T;
}
