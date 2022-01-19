
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function _mergeNamespaces(n, m) {
        m.forEach(function (e) {
            e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
                if (k !== 'default' && !(k in n)) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        });
        return Object.freeze(n);
    }

    function noop() { }
    const identity = x => x;
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait$1() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait$1().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait$1().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait$1().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/parts/Slider.svelte generated by Svelte v3.44.1 */

    const file$b = "src/parts/Slider.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let legend;
    	let t0;
    	let t1;
    	let span;
    	let input0;
    	let input0_class_value;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			legend = element("legend");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			span = element("span");
    			input0 = element("input");
    			input1 = element("input");
    			attr_dev(legend, "class", "svelte-1i2k75q");
    			add_location(legend, file$b, 14, 1, 231);
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "class", input0_class_value = "slider " + /*title*/ ctx[1] + " svelte-1i2k75q");
    			attr_dev(input0, "min", /*min*/ ctx[2]);
    			attr_dev(input0, "max", /*max*/ ctx[3]);
    			attr_dev(input0, "step", /*step*/ ctx[4]);
    			add_location(input0, file$b, 15, 3, 266);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "slider svelte-1i2k75q");
    			attr_dev(input1, "min", /*min*/ ctx[2]);
    			attr_dev(input1, "max", /*max*/ ctx[3]);
    			attr_dev(input1, "step", /*step*/ ctx[4]);
    			add_location(input1, file$b, 15, 78, 341);
    			attr_dev(span, "class", "svelte-1i2k75q");
    			add_location(span, file$b, 14, 27, 257);
    			attr_dev(div, "class", "svelte-1i2k75q");
    			add_location(div, file$b, 13, 0, 224);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, legend);
    			append_dev(legend, t0);
    			append_dev(legend, t1);
    			append_dev(div, span);
    			append_dev(span, input0);
    			set_input_value(input0, /*value*/ ctx[0]);
    			append_dev(span, input1);
    			set_input_value(input1, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[5]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

    			if (dirty & /*title*/ 2 && input0_class_value !== (input0_class_value = "slider " + /*title*/ ctx[1] + " svelte-1i2k75q")) {
    				attr_dev(input0, "class", input0_class_value);
    			}

    			if (dirty & /*min*/ 4) {
    				attr_dev(input0, "min", /*min*/ ctx[2]);
    			}

    			if (dirty & /*max*/ 8) {
    				attr_dev(input0, "max", /*max*/ ctx[3]);
    			}

    			if (dirty & /*step*/ 16) {
    				attr_dev(input0, "step", /*step*/ ctx[4]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(input0, /*value*/ ctx[0]);
    			}

    			if (dirty & /*min*/ 4) {
    				attr_dev(input1, "min", /*min*/ ctx[2]);
    			}

    			if (dirty & /*max*/ 8) {
    				attr_dev(input1, "max", /*max*/ ctx[3]);
    			}

    			if (dirty & /*step*/ 16) {
    				attr_dev(input1, "step", /*step*/ ctx[4]);
    			}

    			if (dirty & /*value*/ 1 && to_number(input1.value) !== /*value*/ ctx[0]) {
    				set_input_value(input1, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, []);
    	let { title = 'Title' } = $$props;
    	let { value = 0 } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { step = 1 } = $$props;
    	const writable_props = ['title', 'value', 'min', 'max', 'step'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	function input0_change_input_handler() {
    		value = to_number(this.value);
    		(($$invalidate(0, value), $$invalidate(2, min)), $$invalidate(3, max));
    	}

    	function input1_input_handler() {
    		value = to_number(this.value);
    		(($$invalidate(0, value), $$invalidate(2, min)), $$invalidate(3, max));
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('min' in $$props) $$invalidate(2, min = $$props.min);
    		if ('max' in $$props) $$invalidate(3, max = $$props.max);
    		if ('step' in $$props) $$invalidate(4, step = $$props.step);
    	};

    	$$self.$capture_state = () => ({ title, value, min, max, step });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('min' in $$props) $$invalidate(2, min = $$props.min);
    		if ('max' in $$props) $$invalidate(3, max = $$props.max);
    		if ('step' in $$props) $$invalidate(4, step = $$props.step);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*min, value, max*/ 13) {
    			// sanitize
    			$$invalidate(0, value = Math.max(min, Math.min(value, max)));
    		}
    	};

    	return [
    		value,
    		title,
    		min,
    		max,
    		step,
    		input0_change_input_handler,
    		input1_input_handler
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			title: 1,
    			value: 0,
    			min: 2,
    			max: 3,
    			step: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get title() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* 
    TODO:
    Environment methods, ie isMobile, isTouchscreen, isHiResScreen, isDesktop, isServer etc
    Extend lerp to accept any-dimensional numberss, and optional easing functions (https://github.com/AndrewRayCode/easing-utils)
    db? Server part for secrets and relay?

    */
    // generators
    const grid = function* (width, height) {
    	height ??= width;
    	let x = 0;
    	do {
    		yield { x: x % width, y: Math.floor(x / width) };
    	} while (++x < width * height)
    };

    const range = function* (start, end, step = 1) {
    	[start, end, step] = (isnt(end)) ? [0, +start, +step] : [+start, +end, +step];
    	const count = (start < end)
    		? () => (start += step) < end
    		: () => (start -= step) > end;
    	do { yield start; } while (count() !== false)
    };

    // iterators
    const times = (times, f = i => i, ...rest) => {
    	const a = [];
    	for (let i of range(Math.abs(times))) a.push(f(i, ...rest));
    	return a
    };

    // arr
    const rangeArray = (start, end, step = 1) => {
    	let arr = [], i = 0;
    	for (const n of range(start, end, step)) arr[i++] = n;
    	return arr
    };

    const unique = arr => [...new Set(arr)];

    const shuffle = arr => {
    	// no mutation, array coercion
    	const a = Array.from(arr);
    	// classic loop for performance reasons
    	for (let i = a.length - 1; i > 0; i--) {
    		const j = random$1(i + 1);
    		[a[i], a[j]] = [a[j], a[i]];
    	}
    	return a
    };

    const sample = (arr, samples = 1) => {
    	// no mutation, array coercion
    	const a = Array.from(arr),
    		s = [];
    	for (const i of range(samples > a.length ? a.length : samples > 0 ? samples : 1))
    		s.push(a.splice(random$1(a.length), 1)[0]);
    	return samples === 1 ? s[0] : s
    };

    // thx https://hackernoon.com/3-javascript-performance-mistakes-you-should-stop-doing-ebf84b9de951
    //sum = arr => arr.reduce( (a, v) => a + Number(v) , 0); < 10xslower
    const sum = arr => {
    	arr = Array.from(arr);
    	let a = 0;
    	for (let i = 0; i < arr.length; i++) a += Number(arr[i]);
    	return a
    };

    const mean = arr => sum(arr) / arr.length;

    const median = arr => {
    	// no mutation
    	const a = Array.from(arr).sort((a, b) => Number(a) - Number(b)),
    		m = Math.floor(arr.length / 2);
    	return (m % 2) ? (Number(a[m - 1]) + Number(a[m])) / 2 : Number(a[m])
    };

    const max = arr => Math.max(...arr);

    const min = arr => Math.min(...arr);

    const groupBy = (arr, prop) => arr.reduce((m, x) =>
    	m.set(x[prop], [...m.get(x[prop]) || [], x]),
    	new Map()
    );

    // SET OPS
    const intersect = (a, b) => Array.from(a).filter(v => Array.from(b).includes(v));

    const subtract = (a, b) => Array.from(a).filter(v => !Array.from(b).includes(v));

    const exclude = (a, b) => {
    	[a, b] = [Array.from(a), Array.from(b)];
    	return a.filter(v => !b.includes(v))
    		.concat(b.filter(v => !a.includes(v)))
    };

    const union = (a, b) => [...new Set([...Array.from(a), ...Array.from(b)])];

    const isSubset = (a, b) => {
    	[a, b] = [Array.from(a), Array.from(b)];
    	return a.length <= b.length && a.every(v => b.includes(v))
    };

    // DOM
    const createElement = (html, isSvg = false) => {
    	const template = document.createElement('template');
    	if (isSvg) {
    		template.innerHTML = `<svg>${ html.trim() }</svg>`;
    		return template.content.firstChild.firstChild
    	}
    	template.innerHTML = html.trim();
    	return template.content.firstChild
    };

    const parseDOMStringMap = o => {
    	// convert from DOMStringMap to object
    	o = { ...o };
    	for (const key in o)
    		// parse what's parseable
    		try { o[key] = JSON.parse(o[key]); } catch (e) { }	return o
    };

    // global data storage
    const d = new WeakMap();

    const data = (element, key, value) => {
    	const thisData = d.has(element) ? d.get(element) : parseDOMStringMap(element.dataset);
    	if (is(value) || isObj(key))
    		d.set(element, Object.assign(thisData, isObj(key) ? key : { [key]: value }));
    	return isStr(key) ? thisData[key] : thisData
    };

    // Finds deepestElement in element matching selector. Potential performance hog for deep DOM structures.
    const deepest = (element, selector = '*') =>
    	Array.from(element.querySelectorAll(selector))
    		.reduce(
    			(deepest, el) => {
    				let depth = 0;
    				for (e = el; e !== element; depth++, e = e.parentNode);
    				return depth > deepest.depth ? { depth: depth, deepestElement: el } : deepest
    			},
    			// accumulator
    			{ depth: 0, deepestElement: element }
    		)
    		.deepestElement;

    // logical

    // Based on https://www.30secondsofcode.org/js/s/equals
    // Checks own enumerable properties only.
    // Does not work for ArrayBuffers because Symbols. Solvable with Object.getOwnPropertySymbols(obj)? Good enough?
    const isEqual = (a, b, deep = true) =>
    	a === b ? true :																				// are strictly equal?
    		a instanceof Date && b instanceof Date ? a.getTime() === b.getTime() :						// are same date?
    			a instanceof Function && b instanceof Function ? '' + a === '' + b :					// are lexically same functions? (Closures not compared)
    				!a || !b || (typeof a !== 'object' && typeof b !== 'object') ? a === b :			// are nullish?
    					Object.getPrototypeOf(a) !== Object.getPrototypeOf(b) ? false :					// have same prototype?
    						Object.keys(a).length !== Object.keys(b).length ? false :					// have same length ? (Iterables)
    							Object.keys(a).every(k => deep ? isEqual(a[k], b[k]) : a[k] === b[k]);	// have same properties and values? (Recursively if deep)

    // clone
    const clone = (v, deep = true) => {
    	const isDeep = v => deep ? clone(v) : v;
    	// no cloning of functions, too gory
    	if (typeof v !== 'object' || isNull(v)) return v
    	// catch arraylike
    	if ('map' in v && isFunc(v.map)) return v.map(i => isDeep(i))
    	if (isMap(v)) return new Map(isDeep(Array.from(v)))
    	if (isSet(v)) return new Set(isDeep(Array.from(v)))
    	if (isDate(v)) {
    		const d = new Date();
    		d.setTime(v.getTime());
    		return d
    	}
    	// todo: Handling of instantiation and prototype (Possible)?
    	//const o = Object.create(Object.getPrototypeOf(v));
    	const o = {};
    	for (const key in v)
    		if (v.hasOwnProperty(key))
    			o[key] = isDeep(v[key]);
    	return o
    };

    const pipe = (v, ...funcs) => funcs.reduce((x, f) => f(x), v);

    const memoise = (f, keymaker) => {
    	const cache = new Map();
    	return (...args) => {
    		const key = keymaker ? keymaker(...args)
    			: args.length > 1 ? args.join('-') : args[0];

    		if (cache.has(key)) return cache.get(key)
    		const result = f(...args);
    		cache.set(key, result);
    		return result
    	}
    };

    // thx https://masteringjs.io/tutorials/fundamentals/enum
    const createEnum = (v) => {
    	const enu = {};
    	for (const val of v) enu[val] = val;
    	return Object.freeze(enu)
    };

    // Untested 
    // pipeAsync = async (v, ...funcs) => await funcs.reduce( async (x, f) => await f(x), v);

    // mathy
    const random$1 = (min, max, float = false) => {
    	// max can be omitted
    	float = isBool(max) ? max : float;
    	[min, max] = isnt(max) || isBool(max)
    		// with no parameters, defaults to 0 or 1
    		? isnt(min) ? [0, 2] : [0, +min]
    		: [+min, +max];
    	return float ? Math.random() * (max - min) + min : Math.floor(Math.random() * (max - min)) + min
    };

    const randomNormal = (mean = 0, sigma = 1) => {
    	const samples = 6;
    	let sum = 0, i = 0;
    	for (i; i < samples; i++) sum += Math.random();
    	return (sigma * 8.35 * (sum - samples / 2)) / samples + mean
    	// ^ hand made spread constant :-) 
    };

    const round = (n, precision = 0) => Math.round(n * 10 ** precision + Number.EPSILON) / 10 ** precision;

    const nthRoot = (x, n) => x ** (1 / Math.abs(n));

    const lerp = (a, b, t) => (1 - t) * a + t * b;

    const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

    const between = (n, min, max) => n >= min && n < max;

    const normalize = (n, min, max, clamp = true) => {
    	n = (n - min) / ((max - min) + Number.EPSILON); // Prevent / by 0
    	return clamp ? clamp(n, 0, 1) : n
    };

    // string
    const prettyNumber = (n, locale = 'sv-SE', precision = 2) => {
    	// lacale can be omitted
    	[locale, precision] = isNum(locale) ? ['sv-SE', locale] : [locale, precision];
    	return Number.isNaN(n) ? '-' : round(n, precision).toLocaleString(locale)
    };

    const wrapFirstWords = (s, numWords = 3, startWrap = '<span>', endWrap = '</span>', startAtChar = 0) =>
    	s.slice(0, startAtChar)
    	+ s.slice(startAtChar)
    		.replace(
    			new RegExp('([\\s]*[a-zA-ZåäöÅÄÖøØ0-9\'’"\-]+){0,' + (numWords) + '}\\S?'),
    			startWrap + '$&' + endWrap
    		);

    const toCamelCase = s => s.match(/^\-\-/) ? s // is css var, so leave it alone
    	: s.replace(/([-_\s])([a-zA-Z0-9])/g, (m, _, c, o) => o ? c.toUpperCase() : c);

    // thx https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
    const toKebabCase = s => s.match(/^\-\-/) ? s // is css var, so leave it alone
    	: s.replace(/\s/g, '-').replace(/([a-z0-9])([A-Z0-9])/g, '$1-$2').toLowerCase();

    const randomChars = () => (Math.random() * 2 ** 64).toString(36).substring(0, 10);

    // Colours
    const toHsla = (c, asString = false) => {
    	let rgba, h, s, l, r, g, b, a;

    	c = c.trim();

    	// Parse
    	if (/^#/.test(c)) {
    		// is hex
    		rgba = Array.from(c)
    			.slice(1) // remove #
    			.flatMap((v, i, a) =>
    				a.length <= 4 // if shorthand
    					? [Number('0x' + v + v)]
    					: i % 2 // if longform
    						? [] // omitted by flatmap
    						: [Number('0x' + v + a[i + 1])] // current + next
    			);
    		// fix alpha
    		if (rgba.length === 4) rgba[3] / 255;

    	} else if (/^rgb\(|^rgba\(/.test(c)) {
    		// is rgb/rgba
    		rgba = c.match(/([0-9\.])+/g).map(v => Number(v)); // Pluck the numbers
    		if (/%/.test(c)) // fix percent
    			rgba = rgba.map((v, i) => (i < 3) ? Math.round(v / 100 * 255) : v);

    	} else if (/^hsl\(|^hsla\(/.test(c)) {
    		// is hsl/hsla
    		[h, s, l, a] = c.match(/([0-9\.])+/g).map(v => Number(v)); // Pluck the numbers
    		a ??= 1;

    	} else { return (warn('Sorry, can\'t parse ' + c), null) }

    	if (rgba) {
    		// convert

    		// add default alpha if needed
    		if (rgba.length === 3) rgba.push(1)
    		// Adapted from https://css-tricks.com/converting-color-spaces-in-javascript/
    		[a] = rgba.map((v, i) => (i < 3) ? v / 255 : v);
    		let
    			cmin = Math.min(r, g, b),
    			cmax = Math.max(r, g, b),
    			delta = cmax - cmin;

    		h = (round(
    			(delta === 0 ? 0 :
    				cmax === r ? ((g - b) / delta) % 6 :
    					cmax === g ? (b - r) / delta + 2 :
    					/*cmax  === b*/	(r - g) / delta + 4)
    			* 60) + 360) % 360; // prevent negatives
    		l = (cmax + cmin) / 2;
    		s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    		// sanitize
    		s = round(s * 100, 2);
    		l = round(l * 100, 2);
    		a = round(a, 2);
    	}

    	return asString ? hsla(h, s, l, a) : { h: h, s: s, l: l, a: a }
    };

    const hsla = (h, s = 70, l = 50, a = 1) => {
    	if (isObj(h)) ({ h, s, l, a } = h);
    	return `hsla(${ (h % 360) }, ${ s }%, ${ l }%, ${ a })`
    };

    // async
    let timeout, rejectPrev; // wow! Closure just works!

    const wait = async (t = 1, f, resetPrevCall = false) => {
    	// callback is optional
    	resetPrevCall = isBool(f) ? f : resetPrevCall;
    	if (resetPrevCall && rejectPrev) {
    		clearTimeout(timeout);
    		rejectPrev();
    	}
    	try {
    		await new Promise((resolve, reject) => {
    			timeout = setTimeout(resolve, t);
    			rejectPrev = reject;
    		});
    		if (isFunc(f)) await f();
    	} catch (e) { }
    };

    const nextFrame = async f => {
    	return new Promise(resolve => requestAnimationFrame(async () => {
    		if (isFunc(f)) await f();
    		resolve();
    	}))
    };

    const waitFrames = async (n = 1, f, everyFrame = false) => {
    	while (n-- > 0) await nextFrame(everyFrame ? f : null);
    	if (isFunc(f) && !everyFrame) await f();
    };

    const waitFor = async (selector, event, f) => {
    	return new Promise(resolve => {
    		document.querySelector(selector).addEventListener(event, async e => {
    			if (isFunc(f)) await f(e);
    			resolve();
    		}, { once: true });
    	})
    };

    // JSON or text
    const load = async (url, isJSON = true) => {
    	try {
    		const response = await fetch(url);
    		return await isJSON ? response.json() : response.text()
    	} catch (e) { error(e); }
    };

    // basic type checking
    const istype = t => v => typeof v === t;
    const isof = t => v => v instanceof t;

    const isBool = istype('boolean');
    const isNum = istype('number');
    const isInt = v => Number.isInteger(v);
    const isBigInt = istype('bigint');
    const isStr = istype('string');
    const isSym = istype('symbol');
    const isFunc = istype('function');
    const isnt = v => v === undefined;
    const is = v => v !== undefined;
    const isNull = v => v === null;
    const isArr = v => Array.isArray(v);
    const isDate = isof(Date);
    const isMap = isof(Map);
    const isSet = isof(Set);
    const isRegex = isof(RegExp);

    const isObj = v => typeof v === 'object' && v !== null
    	&& !isArr(v) && !isDate(v) && !isMap(v) && !isSet(v) && !isRegex(v);

    const isIterable = v => v != null && typeof (v)[Symbol.iterator] === 'function';


    // throttle, debounce, onAnimationFrame

    const throttle = (f, t = 50, debounce = false, immediately = false) => {
    	let timeout, lastRan, running = false;
    	return function () {
    		const context = this, args = arguments;
    		if (!lastRan || (debounce && !running)) {
    			// first run or debounce rerun
    			if (!debounce || immediately) f.apply(context, args);
    			lastRan = Date.now();
    		} else {
    			clearTimeout(timeout);
    			timeout = setTimeout(() => {
    				if (Date.now() - lastRan >= t) {
    					f.apply(context, args);
    					lastRan = Date.now();
    					running = false;
    				}
    			},
    				debounce ? t : t - (Date.now() - lastRan)
    			);
    		}
    		running = true;
    	}
    };

    const debounce = (f, t = 50, immediately = false) => throttle(f, t, true, immediately);

    const onAnimationFrame = f => {
    	let timeout;
    	return function () {
    		const context = this, args = arguments;
    		cancelAnimationFrame(timeout);
    		timeout = requestAnimationFrame(() => f.apply(context, args));
    	}
    };

    // util & environment

    // export const q = document.querySelector.bind(document);
    // export const qa = document.querySelectorAll.bind(document);

    const getLocal = item => {
    	const i = localStorage.getItem(item);
    	return i && JSON.parse(i)
    };

    const setLocal = (item, v) => (localStorage.setItem(item, JSON.stringify(v)), v);

    const getCss = (prop, selector = ':root') => document.querySelector(selector).style.getPropertyValue(prop);

    const setCss = (prop, v, selector = ':root') => (document.querySelector(selector).style.setProperty(prop, v), v);

    // verbose errors
    let isVerbose = true, isThrowing = false;

    const verbose = (v, t = false) => isnt(v) ? isVerbose : (isThrowing = !!t, isVerbose = !!v);

    const error = (e, ...r) => {
    	if (isVerbose) {
    		if (isThrowing) throw new Error(e)
    		else console.error(message(e), ...r);
    	}
    	return r ? [e, ...r] : e
    };

    const warn = (msg, ...r) => isVerbose && !console.warn(message(msg), ...r) && r ? [msg, ...r] : msg;

    const log = (...msg) => isVerbose && !console.log(...msg) && msg.length === 1 ? msg[0] : msg;

    const message = s => `ö🍳uery says: ${ s }\n`;

    // stuff		
    const toString = () => `Hello ö🍳uery!`;

    const rorövovarorsospoproråkoketot = s => (s || '').replace(/[bcdfghjklmnpqrstvwxyz]/gi, m => m + 'o' + m.toLowerCase());

    var ö = /*#__PURE__*/Object.freeze({
        __proto__: null,
        grid: grid,
        range: range,
        times: times,
        rangeArray: rangeArray,
        unique: unique,
        shuffle: shuffle,
        sample: sample,
        sum: sum,
        mean: mean,
        median: median,
        max: max,
        min: min,
        groupBy: groupBy,
        intersect: intersect,
        subtract: subtract,
        exclude: exclude,
        union: union,
        isSubset: isSubset,
        createElement: createElement,
        parseDOMStringMap: parseDOMStringMap,
        data: data,
        deepest: deepest,
        isEqual: isEqual,
        clone: clone,
        pipe: pipe,
        memoise: memoise,
        createEnum: createEnum,
        random: random$1,
        randomNormal: randomNormal,
        round: round,
        nthRoot: nthRoot,
        lerp: lerp,
        clamp: clamp,
        between: between,
        normalize: normalize,
        prettyNumber: prettyNumber,
        wrapFirstWords: wrapFirstWords,
        toCamelCase: toCamelCase,
        toKebabCase: toKebabCase,
        randomChars: randomChars,
        toHsla: toHsla,
        hsla: hsla,
        wait: wait,
        nextFrame: nextFrame,
        waitFrames: waitFrames,
        waitFor: waitFor,
        load: load,
        isBool: isBool,
        isNum: isNum,
        isInt: isInt,
        isBigInt: isBigInt,
        isStr: isStr,
        isSym: isSym,
        isFunc: isFunc,
        isnt: isnt,
        is: is,
        isNull: isNull,
        isArr: isArr,
        isDate: isDate,
        isMap: isMap,
        isSet: isSet,
        isRegex: isRegex,
        isObj: isObj,
        isIterable: isIterable,
        throttle: throttle,
        debounce: debounce,
        onAnimationFrame: onAnimationFrame,
        getLocal: getLocal,
        setLocal: setLocal,
        getCss: getCss,
        setCss: setCss,
        verbose: verbose,
        error: error,
        warn: warn,
        log: log,
        message: message,
        toString: toString,
        'rorövovarorsospoproråkoketot': rorövovarorsospoproråkoketot
    });

    /* src/parts/Switch.svelte generated by Svelte v3.44.1 */
    const file$a = "src/parts/Switch.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(/*title*/ ctx[1]);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "switch");
    			attr_dev(input, "id", /*id*/ ctx[2]);
    			add_location(input, file$a, 9, 1, 142);
    			attr_dev(label, "for", /*id*/ ctx[2]);
    			attr_dev(label, "class", "svelte-1swjpcc");
    			add_location(label, file$a, 10, 1, 210);
    			attr_dev(div, "class", "svelte-1swjpcc");
    			add_location(div, file$a, 8, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = /*value*/ ctx[0];
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 4) {
    				attr_dev(input, "id", /*id*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1) {
    				input.checked = /*value*/ ctx[0];
    			}

    			if (dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);

    			if (dirty & /*id*/ 4) {
    				attr_dev(label, "for", /*id*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Switch', slots, []);
    	let { title = 'Title' } = $$props;
    	let { id = randomChars() } = $$props;
    	let { value = 0 } = $$props;
    	const writable_props = ['title', 'id', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Switch> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		value = this.checked;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ ö, title, id, value });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, title, id, input_change_handler];
    }

    class Switch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { title: 1, id: 2, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Switch",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get title() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/parts/Button.svelte generated by Svelte v3.44.1 */
    const file$9 = "src/parts/Button.svelte";

    function create_fragment$9(ctx) {
    	let a;
    	let t;
    	let a_class_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(a, "href", /*url*/ ctx[2]);
    			attr_dev(a, "class", a_class_value = "button " + /*type*/ ctx[1] + " svelte-193ryog");
    			toggle_class(a, "isFullWidth", /*isFullWidth*/ ctx[3]);
    			add_location(a, file$9, 10, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);

    			if (dirty & /*url*/ 4) {
    				attr_dev(a, "href", /*url*/ ctx[2]);
    			}

    			if (dirty & /*type*/ 2 && a_class_value !== (a_class_value = "button " + /*type*/ ctx[1] + " svelte-193ryog")) {
    				attr_dev(a, "class", a_class_value);
    			}

    			if (dirty & /*type, isFullWidth*/ 10) {
    				toggle_class(a, "isFullWidth", /*isFullWidth*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, []);
    	let { title, type, url, isFullWidth = false } = $$props;
    	const writable_props = ['title', 'type', 'url', 'isFullWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('isFullWidth' in $$props) $$invalidate(3, isFullWidth = $$props.isFullWidth);
    	};

    	$$self.$capture_state = () => ({ ö, title, type, url, isFullWidth });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('isFullWidth' in $$props) $$invalidate(3, isFullWidth = $$props.isFullWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, type, url, isFullWidth];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			title: 0,
    			type: 1,
    			url: 2,
    			isFullWidth: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Button> was created without expected prop 'title'");
    		}

    		if (/*type*/ ctx[1] === undefined && !('type' in props)) {
    			console.warn("<Button> was created without expected prop 'type'");
    		}

    		if (/*url*/ ctx[2] === undefined && !('url' in props)) {
    			console.warn("<Button> was created without expected prop 'url'");
    		}
    	}

    	get title() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFullWidth() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFullWidth(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/parts/Loader.svelte generated by Svelte v3.44.1 */

    const file$8 = "src/parts/Loader.svelte";

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "svelte-1jvhlwz");
    			add_location(div0, file$8, 1, 1, 22);
    			attr_dev(div1, "class", "loader svelte-1jvhlwz");
    			add_location(div1, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loader', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var index_umd$2 = createCommonjsModule(function (module, exports) {
    !function(t,e){e(exports);}(commonjsGlobal,(function(t){function e(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r);}return n}function n(t){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?e(Object(r),!0).forEach((function(e){c(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function r(t){return (r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function o(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}function c(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function s(t,e){if(null==t)return {};var n,r,a=function(t,e){if(null==t)return {};var n,r,a={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n]);}return a}function u(t){return function(t){if(Array.isArray(t))return t}(t)||f(t)||p(t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t){return function(t){if(Array.isArray(t))return h(t)}(t)||f(t)||p(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function p(t,e){if(t){if("string"==typeof t)return h(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?h(t,e):void 0}}function h(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function d(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=p(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,a=function(){};return {s:a,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,c=!1;return {s:function(){n=n.call(t);},n:function(){var t=n.next();return o=t.done,t},e:function(t){c=!0,i=t;},f:function(){try{o||null==n.return||n.return();}finally{if(c)throw i}}}}function v(t){var e=function(t,e){if("object"!=typeof t||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return ("string"===e?String:Number)(t)}(t,"string");return "symbol"==typeof e?e:String(e)}var g=-2147483648,b=2147483647;function m(t){return t^=t<<13,t^=t>>17,t^=t<<5}function y(t){var e,n=function(t){for(var e=0,n=0;n<t.length;n++)e=m(e=(e<<5)-e+t.charCodeAt(n)|0);return e}(t=null!==(e=t)&&void 0!==e?e:g+Math.floor((b-g)*Math.random()).toString())||1,r=function(t,e){return Math.floor(((n=m(n))-g)/(b-g)*(e+1-t)+t)};return {seed:t,bool:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:50;return r(0,100)<t},integer:function(t,e){return r(t,e)},pick:function(t){return t[r(0,t.length-1)]}}}var A=Object.freeze({__proto__:null,create:y}),F=function(){function t(e){a(this,t),c(this,"prng",void 0),c(this,"seed",void 0),this.prng=y(e),this.seed=this.prng.seed;}return o(t,[{key:"bool",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:50;return this.prng.bool(t)}},{key:"integer",value:function(t,e){return this.prng.integer(t,e)}},{key:"pickone",value:function(t){return this.prng.pick(t)}}]),t}();var w=function(t){4!==t.length&&5!==t.length||(t=function(t){for(var e="#",n=1;n<t.length;n++){var r=t.charAt(n);e+=r+r;}return e}(t));var e=[parseInt(t.substring(1,3),16),parseInt(t.substring(3,5),16),parseInt(t.substring(5,7),16)];if(9===t.length){var n=parseFloat((parseInt(t.substring(7,9),16)/255).toFixed(2));e.push(n);}return e};var E=function(t){var e,n,r=t[0],a=t[1],i=t[2],o=Math.min(r,a,i),c=Math.max(r,a,i),s=c-o;return n=0==c?0:s/c*1e3/10,c==o?e=0:r==c?e=(a-i)/s:a==c?e=2+(i-r)/s:i==c&&(e=4+(r-a)/s),(e=Math.min(60*e,360))<0&&(e+=360),[e,n,c/255*1e3/10]};var _=function(t,e,n){return Math.min(Math.max(t,e),n)};function C(t){var e=Math.round(_(t,0,255)).toString(16);return 1==e.length?"0"+e:e}var x=function(t){var e=4===t.length?C(255*t[3]):"";return "#"+C(t[0])+C(t[1])+C(t[2])+e};var j=function(t){var e=t[0]/60,n=t[1]/100,r=t[2]/100,a=Math.floor(e)%6,i=e-Math.floor(e),o=255*r*(1-n),c=255*r*(1-n*i),s=255*r*(1-n*(1-i));switch(r*=255,a){case 0:return [r,s,o];case 1:return [c,r,o];case 2:return [o,r,s];case 3:return [o,c,r];case 4:return [s,o,r];case 5:return [r,o,c]}},B={amber:{50:"#FFF8E1",100:"#FFECB3",200:"#FFE082",300:"#FFB74D",400:"#FFCA28",500:"#FFC107",600:"#FFB300",700:"#FFA000",800:"#FF8F00",900:"#FF6F00"},blue:{50:"#E3F2FD",100:"#BBDEFB",200:"#90CAF9",300:"#64B5F6",400:"#42A5F5",500:"#2196F3",600:"#1E88E5",700:"#1976D2",800:"#1565C0",900:"#0D47A1"},blueGrey:{50:"#ECEFF1",100:"#CFD8DC",200:"#B0BEC5",300:"#90A4AE",400:"#78909C",500:"#607D8B",600:"#546E7A",700:"#455A64",800:"#37474F",900:"#263238"},brown:{50:"#EFEBE9",100:"#D7CCC8",200:"#BCAAA4",300:"#A1887F",400:"#8D6E63",500:"#795548",600:"#6D4C41",700:"#5D4037",800:"#4E342E",900:"#3E2723"},cyan:{50:"#E0F7FA",100:"#B2EBF2",200:"#80DEEA",300:"#4DD0E1",400:"#26C6DA",500:"#00BCD4",600:"#00ACC1",700:"#0097A7",800:"#00838F",900:"#006064"},deepOrange:{50:"#FBE9E7",100:"#FFCCBC",200:"#FFAB91",300:"#A1887F",400:"#FF7043",500:"#FF5722",600:"#F4511E",700:"#E64A19",800:"#D84315",900:"#BF360C"},deepPurple:{50:"#EDE7F6",100:"#D1C4E9",200:"#B39DDB",300:"#9575CD",400:"#7E57C2",500:"#673AB7",600:"#5E35B1",700:"#512DA8",800:"#4527A0",900:"#311B92"},green:{50:"#E8F5E9",100:"#C8E6C9",200:"#A5D6A7",300:"#81C784",400:"#66BB6A",500:"#4CAF50",600:"#43A047",700:"#388E3C",800:"#2E7D32",900:"#1B5E20"},grey:{50:"#FAFAFA",100:"#F5F5F5",200:"#EEEEEE",300:"#E0E0E0",400:"#BDBDBD",500:"#9E9E9E",600:"#757575",700:"#616161",800:"#424242",900:"#212121"},indigo:{50:"#E8EAF6",100:"#C5CAE9",200:"#9FA8DA",300:"#7986CB",400:"#5C6BC0",500:"#3F51B5",600:"#3949AB",700:"#303F9F",800:"#283593",900:"#1A237E"},lightBlue:{50:"#E1F5FE",100:"#B3E5FC",200:"#81D4FA",300:"#4FC3F7",400:"#29B6F6",500:"#03A9F4",600:"#039BE5",700:"#0288D1",800:"#0277BD",900:"#01579B"},lightGreen:{50:"#F1F8E9",100:"#DCEDC8",200:"#C5E1A5",300:"#AED581",400:"#9CCC65",500:"#8BC34A",600:"#7CB342",700:"#689F38",800:"#558B2F",900:"#33691E"},lime:{50:"#F9FBE7",100:"#F0F4C3",200:"#E6EE9C",300:"#DCE775",400:"#D4E157",500:"#CDDC39",600:"#C0CA33",700:"#AFB42B",800:"#9E9D24",900:"#827717"},orange:{50:"#FFF3E0",100:"#FFE0B2",200:"#FFCC80",300:"#FF8A65",400:"#FFA726",500:"#FF9800",600:"#FB8C00",700:"#F57C00",800:"#EF6C00",900:"#E65100"},pink:{50:"#FCE4EC",100:"#F8BBD0",200:"#F48FB1",300:"#F06292",400:"#EC407A",500:"#E91E63",600:"#D81B60",700:"#C2185B",800:"#AD1457",900:"#880E4F"},purple:{50:"#F3E5F5",100:"#E1BEE7",200:"#CE93D8",300:"#BA68C8",400:"#AB47BC",500:"#9C27B0",600:"#8E24AA",700:"#7B1FA2",800:"#6A1B9A",900:"#4A148C"},red:{50:"#FFEBEE",100:"#FFCDD2",200:"#EF9A9A",300:"#E57373",400:"#EF5350",500:"#F44336",600:"#E53935",700:"#D32F2F",800:"#C62828",900:"#B71C1C"},teal:{50:"#E0F2F1",100:"#B2DFDB",200:"#80CBC4",300:"#4DB6AC",400:"#26A69A",500:"#009688",600:"#00897B",700:"#00796B",800:"#00695C",900:"#004D40"},yellow:{50:"#FFFDE7",100:"#FFF9C4",200:"#FFF59D",300:"#FFF176",400:"#FFEE58",500:"#FFEB3B",600:"#FDD835",700:"#FBC02D",800:"#F9A825",900:"#F57F17"}},O=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"#000";if(a(this,t),c(this,"alpha",1),c(this,"color",{}),"#"==e[0])this.hex=e;else {var n=/^(rgb|rgba|hsv)\(([0-9\%\,\.\s]+)\)$/.exec(e.trim());if(!n)throw new Error("Unknown color format: "+e);var r=n[2].split(",").map((function(t){return parseInt(t.trim())}));switch(n[1]){case"rgb":this.rgb=r;break;case"rgba":this.rgba=r;break;case"hsv":this.hsv=r;break;default:throw new Error("Unsupported color format: "+e)}}}return o(t,[{key:"clone",value:function(){return new t("rgb("+this.rgb.join(",")+")")}},{key:"rgb",get:function(){return this.color.rgb=this.color.rgb||(this.color.hex?this.hexToRgb(this.hex):this.hsvToRgb(this.hsv))},set:function(t){if(3!=t.length)throw new Error("An array with a length of 3 is expected.");this.alpha=1,this.color={rgb:t};}},{key:"rgba",get:function(){return [this.rgb[0],this.rgb[1],this.rgb[2],this.alpha]},set:function(t){if(4!=t.length)throw new Error("An array with a length of 3 is expected.");this.rgb=[t[0],t[1],t[2]],this.alpha=t[3];}},{key:"hsv",get:function(){return (this.color.hsv=this.color.hsv||this.rgbToHsv(this.rgb)).slice(0)},set:function(t){if(3!=t.length)throw new Error("An array with a length of 3 is expected.");this.alpha=1,this.color={hsv:t};}},{key:"hex",get:function(){return (this.color.hex=this.color.hex||this.rgbToHex(this.rgb)).slice(0)},set:function(t){this.alpha=1,this.color={hex:t};}},{key:"brighterThan",value:function(t,e){var n=this.hsv,r=t.hsv;return n[2]>=r[2]+e||(n[2]=r[2]+e,n[2]>360&&(n[2]=360),this.hsv=n),this}},{key:"darkerThan",value:function(t,e){var n=this.hsv,r=t.hsv;return n[2]<=r[2]-e||(n[2]=r[2]-e,n[2]<0&&(n[2]=0),this.hsv=n),this}},{key:"brighterOrDarkerThan",value:function(t,e){var n=this.hsv,r=t.hsv;return n[2]<=r[2]?this.darkerThan(t,e):this.brighterThan(t,e)}},{key:"rgbToHex",value:function(t){return x(t)}},{key:"hexToRgb",value:function(t){return w(t).map((function(t){return Math.round(t)}))}},{key:"rgbToHsv",value:function(t){return E(t).map((function(t){return Math.round(t)}))}},{key:"hsvToRgb",value:function(t){return j(t).map((function(t){return Math.round(t)}))}}]),t}();c(O,"collection",B);var k=Object.freeze({__proto__:null,collection:B,default:O}),D=function(t){return null!=t&&"object"===r(t)&&!1===Array.isArray(t)};
    /*!
       * isobject <https://github.com/jonschlinkert/isobject>
       *
       * Copyright (c) 2014-2017, Jon Schlinkert.
       * Released under the MIT License.
       */
    /*!
       * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
       *
       * Copyright (c) 2014-2017, Jon Schlinkert.
       * Released under the MIT License.
       */
    function S(t){return !0===D(t)&&"[object Object]"===Object.prototype.toString.call(t)}var N={}.toString,M=Array.isArray||function(t){return "[object Array]"==N.call(t)},T=function(t,e){if(null==t)return !1;if("boolean"==typeof t)return !0;if("number"==typeof t)return 0!==t||!0!==e;if(void 0!==t.length)return 0!==t.length;for(var n in t)if(t.hasOwnProperty(n))return !0;return !1},P=function(t,e,n,a,i){if(null===(o=t)||"object"!==r(o)&&"function"!=typeof o||!e)return t;var o;if(e=z(e),n&&(e+="."+z(n)),a&&(e+="."+z(a)),i&&(e+="."+z(i)),e in t)return t[e];for(var c=e.split("."),s=c.length,u=-1;t&&++u<s;){for(var l=c[u];"\\"===l[l.length-1];)l=l.slice(0,-1)+"."+c[++u];t=t[l];}return t};function z(t){return t?Array.isArray(t)?t.join("."):t:""}
    /*!
       * has-value <https://github.com/jonschlinkert/has-value>
       *
       * Copyright (c) 2014-2016, Jon Schlinkert.
       * Licensed under the MIT License.
       */var I=function(t,e,n){return null!=(a=t)&&"object"===r(a)&&!1===M(a)?T(P(t,e),n):T(t,e);var a;},R=function(t,e){if(!D(t))throw new TypeError("expected an object.");if(t.hasOwnProperty(e))return delete t[e],!0;if(I(t,e)){for(var n=e.split("."),r=n.pop();n.length&&"\\"===n[n.length-1].slice(-1);)r=n.pop().slice(0,-1)+"."+r;for(;n.length;)t=t[e=n.shift()];return delete t[r]}return !0},L=function t(e,n){if(void 0===e)return {};if(Array.isArray(e)){for(var r=0;r<e.length;r++)e[r]=t(e[r],n);return e}if(!1===S(a=e)||"function"!=typeof(i=a.constructor)||!1===S(o=i.prototype)||!1===o.hasOwnProperty("isPrototypeOf"))return e;var a,i,o;if("string"==typeof n&&(n=[n]),!Array.isArray(n))return e;for(var c=0;c<n.length;c++)R(e,n[c]);for(var s in e)e.hasOwnProperty(s)&&(e[s]=t(e[s],n));return e},q=function(t){return null!=t&&(V(t)||function(t){return "function"==typeof t.readFloatLE&&"function"==typeof t.slice&&V(t.slice(0,0))}(t)||!!t._isBuffer)};
    /*!
       * unset-value <https://github.com/jonschlinkert/unset-value>
       *
       * Copyright (c) 2015, 2017, Jon Schlinkert.
       * Released under the MIT License.
       */function V(t){return !!t.constructor&&"function"==typeof t.constructor.isBuffer&&t.constructor.isBuffer(t)}var W=Object.prototype.toString,U=function(t){if(void 0===t)return "undefined";if(null===t)return "null";if(!0===t||!1===t||t instanceof Boolean)return "boolean";if("string"==typeof t||t instanceof String)return "string";if("number"==typeof t||t instanceof Number)return "number";if("function"==typeof t||t instanceof Function)return "function";if(void 0!==Array.isArray&&Array.isArray(t))return "array";if(t instanceof RegExp)return "regexp";if(t instanceof Date)return "date";var e=W.call(t);return "[object RegExp]"===e?"regexp":"[object Date]"===e?"date":"[object Arguments]"===e?"arguments":"[object Error]"===e?"error":q(t)?"buffer":"[object Set]"===e?"set":"[object WeakSet]"===e?"weakset":"[object Map]"===e?"map":"[object WeakMap]"===e?"weakmap":"[object Symbol]"===e?"symbol":"[object Int8Array]"===e?"int8array":"[object Uint8Array]"===e?"uint8array":"[object Uint8ClampedArray]"===e?"uint8clampedarray":"[object Int16Array]"===e?"int16array":"[object Uint16Array]"===e?"uint16array":"[object Int32Array]"===e?"int32array":"[object Uint32Array]"===e?"uint32array":"[object Float32Array]"===e?"float32array":"[object Float64Array]"===e?"float64array":"object"};function $(t){var e={exports:{}};return t(e,e.exports),e.exports}var H=$((function(t){!function(){function e(t,e){if("function"!=typeof e)return t;var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[e(r,t[r])||r]=t[r]);return n}t.exports?t.exports=e:window.rename=e;}();})),Z=function t(e,n){var r=U(e);if("object"!==r&&"array"!==r)throw new Error("expected an object");var a=[];for(var i in "object"===r&&(e=H(e,n),a={}),e)if(e.hasOwnProperty(i)){var o=e[i];"object"===U(o)||"array"===U(o)?a[i]=t(o,n):a[i]=o;}return a},X=$((function(t){var e=Object.prototype.hasOwnProperty,n="~";function r(){}function a(t,e,n){this.fn=t,this.context=e,this.once=n||!1;}function i(){this._events=new r,this._eventsCount=0;}Object.create&&(r.prototype=Object.create(null),(new r).__proto__||(n=!1)),i.prototype.eventNames=function(){var t,r,a=[];if(0===this._eventsCount)return a;for(r in t=this._events)e.call(t,r)&&a.push(n?r.slice(1):r);return Object.getOwnPropertySymbols?a.concat(Object.getOwnPropertySymbols(t)):a},i.prototype.listeners=function(t,e){var r=n?n+t:t,a=this._events[r];if(e)return !!a;if(!a)return [];if(a.fn)return [a.fn];for(var i=0,o=a.length,c=new Array(o);i<o;i++)c[i]=a[i].fn;return c},i.prototype.emit=function(t,e,r,a,i,o){var c=n?n+t:t;if(!this._events[c])return !1;var s,u,l=this._events[c],f=arguments.length;if(l.fn){switch(l.once&&this.removeListener(t,l.fn,void 0,!0),f){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,e),!0;case 3:return l.fn.call(l.context,e,r),!0;case 4:return l.fn.call(l.context,e,r,a),!0;case 5:return l.fn.call(l.context,e,r,a,i),!0;case 6:return l.fn.call(l.context,e,r,a,i,o),!0}for(u=1,s=new Array(f-1);u<f;u++)s[u-1]=arguments[u];l.fn.apply(l.context,s);}else {var p,h=l.length;for(u=0;u<h;u++)switch(l[u].once&&this.removeListener(t,l[u].fn,void 0,!0),f){case 1:l[u].fn.call(l[u].context);break;case 2:l[u].fn.call(l[u].context,e);break;case 3:l[u].fn.call(l[u].context,e,r);break;case 4:l[u].fn.call(l[u].context,e,r,a);break;default:if(!s)for(p=1,s=new Array(f-1);p<f;p++)s[p-1]=arguments[p];l[u].fn.apply(l[u].context,s);}}return !0},i.prototype.on=function(t,e,r){var i=new a(e,r||this),o=n?n+t:t;return this._events[o]?this._events[o].fn?this._events[o]=[this._events[o],i]:this._events[o].push(i):(this._events[o]=i,this._eventsCount++),this},i.prototype.once=function(t,e,r){var i=new a(e,r||this,!0),o=n?n+t:t;return this._events[o]?this._events[o].fn?this._events[o]=[this._events[o],i]:this._events[o].push(i):(this._events[o]=i,this._eventsCount++),this},i.prototype.removeListener=function(t,e,a,i){var o=n?n+t:t;if(!this._events[o])return this;if(!e)return 0==--this._eventsCount?this._events=new r:delete this._events[o],this;var c=this._events[o];if(c.fn)c.fn!==e||i&&!c.once||a&&c.context!==a||(0==--this._eventsCount?this._events=new r:delete this._events[o]);else {for(var s=0,u=[],l=c.length;s<l;s++)(c[s].fn!==e||i&&!c[s].once||a&&c[s].context!==a)&&u.push(c[s]);u.length?this._events[o]=1===u.length?u[0]:u:0==--this._eventsCount?this._events=new r:delete this._events[o];}return this},i.prototype.removeAllListeners=function(t){var e;return t?(e=n?n+t:t,this._events[e]&&(0==--this._eventsCount?this._events=new r:delete this._events[e])):(this._events=new r,this._eventsCount=0),this},i.prototype.off=i.prototype.removeListener,i.prototype.addListener=i.prototype.on,i.prototype.setMaxListeners=function(){return this},i.prefixed=n,i.EventEmitter=i,t.exports=i;})),Y=$((function(t){var e=Object.prototype.hasOwnProperty,n="~";function r(){}function a(t,e,n){this.fn=t,this.context=e,this.once=n||!1;}function i(){this._events=new r,this._eventsCount=0;}Object.create&&(r.prototype=Object.create(null),(new r).__proto__||(n=!1)),i.prototype.eventNames=function(){var t,r,a=[];if(0===this._eventsCount)return a;for(r in t=this._events)e.call(t,r)&&a.push(n?r.slice(1):r);return Object.getOwnPropertySymbols?a.concat(Object.getOwnPropertySymbols(t)):a},i.prototype.listeners=function(t,e){var r=n?n+t:t,a=this._events[r];if(e)return !!a;if(!a)return [];if(a.fn)return [a.fn];for(var i=0,o=a.length,c=new Array(o);i<o;i++)c[i]=a[i].fn;return c},i.prototype.emit=function(t,e,r,a,i,o){var c=n?n+t:t;if(!this._events[c])return !1;var s,u,l=this._events[c],f=arguments.length;if(l.fn){switch(l.once&&this.removeListener(t,l.fn,void 0,!0),f){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,e),!0;case 3:return l.fn.call(l.context,e,r),!0;case 4:return l.fn.call(l.context,e,r,a),!0;case 5:return l.fn.call(l.context,e,r,a,i),!0;case 6:return l.fn.call(l.context,e,r,a,i,o),!0}for(u=1,s=new Array(f-1);u<f;u++)s[u-1]=arguments[u];l.fn.apply(l.context,s);}else {var p,h=l.length;for(u=0;u<h;u++)switch(l[u].once&&this.removeListener(t,l[u].fn,void 0,!0),f){case 1:l[u].fn.call(l[u].context);break;case 2:l[u].fn.call(l[u].context,e);break;case 3:l[u].fn.call(l[u].context,e,r);break;case 4:l[u].fn.call(l[u].context,e,r,a);break;default:if(!s)for(p=1,s=new Array(f-1);p<f;p++)s[p-1]=arguments[p];l[u].fn.apply(l[u].context,s);}}return !0},i.prototype.on=function(t,e,r){var i=new a(e,r||this),o=n?n+t:t;return this._events[o]?this._events[o].fn?this._events[o]=[this._events[o],i]:this._events[o].push(i):(this._events[o]=i,this._eventsCount++),this},i.prototype.once=function(t,e,r){var i=new a(e,r||this,!0),o=n?n+t:t;return this._events[o]?this._events[o].fn?this._events[o]=[this._events[o],i]:this._events[o].push(i):(this._events[o]=i,this._eventsCount++),this},i.prototype.removeListener=function(t,e,a,i){var o=n?n+t:t;if(!this._events[o])return this;if(!e)return 0==--this._eventsCount?this._events=new r:delete this._events[o],this;var c=this._events[o];if(c.fn)c.fn!==e||i&&!c.once||a&&c.context!==a||(0==--this._eventsCount?this._events=new r:delete this._events[o]);else {for(var s=0,u=[],l=c.length;s<l;s++)(c[s].fn!==e||i&&!c[s].once||a&&c[s].context!==a)&&u.push(c[s]);u.length?this._events[o]=1===u.length?u[0]:u:0==--this._eventsCount?this._events=new r:delete this._events[o];}return this},i.prototype.removeAllListeners=function(t){var e;return t?(e=n?n+t:t,this._events[e]&&(0==--this._eventsCount?this._events=new r:delete this._events[e])):(this._events=new r,this._eventsCount=0),this},i.prototype.off=i.prototype.removeListener,i.prototype.addListener=i.prototype.on,i.prototype.setMaxListeners=function(){return this},i.prefixed=n,i.EventEmitter=i,t.exports=i;}));
    /*!
       * deep-rename-keys <https://github.com/jonschlinkert/deep-rename-keys>
       *
       * Copyright (c) 2015 Jon Schlinkert, contributors.
       * Licensed under the MIT license.
       */function G(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var J=function(){},K={data:"state-data",cdata:"state-cdata",tagBegin:"state-tag-begin",tagName:"state-tag-name",tagEnd:"state-tag-end",attributeNameStart:"state-attribute-name-start",attributeName:"state-attribute-name",attributeNameEnd:"state-attribute-name-end",attributeValueBegin:"state-attribute-value-begin",attributeValue:"state-attribute-value"},Q={lt:"action-lt",gt:"action-gt",space:"action-space",equal:"action-equal",quote:"action-quote",slash:"action-slash",char:"action-char",error:"action-error"},tt={text:"text",openTag:"open-tag",closeTag:"close-tag",attributeName:"attribute-name",attributeValue:"attribute-value"},et={" ":Q.space,"\t":Q.space,"\n":Q.space,"\r":Q.space,"<":Q.lt,">":Q.gt,'"':Q.quote,"'":Q.quote,"=":Q.equal,"/":Q.slash},nt=function(t){var e,n,r,a,i,o,c,s,u,l;t=Object.assign({debug:!1},t);var f=new Y,p=K.data,h="",d="",v="",g="",b="",m="",y=function(e,n){if("?"!==d[0]&&"!"!==d[0]){var r={type:e,value:n};t.debug&&console.log("emit:",r),f.emit("data",r);}};f.stateMachine=(G(l={},K.data,(G(e={},Q.lt,(function(){h.trim()&&y(tt.text,h),d="",b=!1,p=K.tagBegin;})),G(e,Q.char,(function(t){h+=t;})),e)),G(l,K.cdata,G({},Q.char,(function(t){"]]>"===(h+=t).substr(-3)&&(y(tt.text,h.slice(0,-3)),h="",p=K.data);}))),G(l,K.tagBegin,(G(n={},Q.space,J),G(n,Q.char,(function(t){d=t,p=K.tagName;})),G(n,Q.slash,(function(){d="",b=!0;})),n)),G(l,K.tagName,(G(r={},Q.space,(function(){b?p=K.tagEnd:(p=K.attributeNameStart,y(tt.openTag,d));})),G(r,Q.gt,(function(){y(b?tt.closeTag:tt.openTag,d),h="",p=K.data;})),G(r,Q.slash,(function(){p=K.tagEnd,y(tt.openTag,d);})),G(r,Q.char,(function(t){"![CDATA["===(d+=t)&&(p=K.cdata,h="",d="");})),r)),G(l,K.tagEnd,(G(a={},Q.gt,(function(){y(tt.closeTag,d),h="",p=K.data;})),G(a,Q.char,J),a)),G(l,K.attributeNameStart,(G(i={},Q.char,(function(t){v=t,p=K.attributeName;})),G(i,Q.gt,(function(){h="",p=K.data;})),G(i,Q.space,J),G(i,Q.slash,(function(){b=!0,p=K.tagEnd;})),i)),G(l,K.attributeName,(G(o={},Q.space,(function(){p=K.attributeNameEnd;})),G(o,Q.equal,(function(){y(tt.attributeName,v),p=K.attributeValueBegin;})),G(o,Q.gt,(function(){g="",y(tt.attributeName,v),y(tt.attributeValue,g),h="",p=K.data;})),G(o,Q.slash,(function(){b=!0,g="",y(tt.attributeName,v),y(tt.attributeValue,g),p=K.tagEnd;})),G(o,Q.char,(function(t){v+=t;})),o)),G(l,K.attributeNameEnd,(G(c={},Q.space,J),G(c,Q.equal,(function(){y(tt.attributeName,v),p=K.attributeValueBegin;})),G(c,Q.gt,(function(){g="",y(tt.attributeName,v),y(tt.attributeValue,g),h="",p=K.data;})),G(c,Q.char,(function(t){g="",y(tt.attributeName,v),y(tt.attributeValue,g),v=t,p=K.attributeName;})),c)),G(l,K.attributeValueBegin,(G(s={},Q.space,J),G(s,Q.quote,(function(t){m=t,g="",p=K.attributeValue;})),G(s,Q.gt,(function(){y(tt.attributeValue,g=""),h="",p=K.data;})),G(s,Q.char,(function(t){m="",g=t,p=K.attributeValue;})),s)),G(l,K.attributeValue,(G(u={},Q.space,(function(t){m?g+=t:(y(tt.attributeValue,g),p=K.attributeNameStart);})),G(u,Q.quote,(function(t){m===t?(y(tt.attributeValue,g),p=K.attributeNameStart):g+=t;})),G(u,Q.gt,(function(t){m?g+=t:(y(tt.attributeValue,g),h="",p=K.data);})),G(u,Q.slash,(function(t){m?g+=t:(y(tt.attributeValue,g),b=!0,p=K.tagEnd);})),G(u,Q.char,(function(t){g+=t;})),u)),l);var A=function(e){t.debug&&console.log(p,e);var n=f.stateMachine[p];(n[function(t){return et[t]||Q.char}(e)]||n[Q.error]||n[Q.char])(e);};return f.write=function(t){for(var e=t.length,n=0;n<e;n++)A(t[n]);},f},rt=tt,at={element:"element",text:"text"},it=function(t){return Object.assign({name:"",type:at.element,value:"",parent:null,attributes:{},children:[]},t)},ot=function(t){t=Object.assign({stream:!1,parentNodes:!0,doneEvent:"done",tagPrefix:"tag:",emitTopLevelOnly:!1,debug:!1},t);var e=void 0,n=void 0,r=void 0,a=void 0,i=new X,o=function(o){switch(o.type){case rt.openTag:if(null===r)(r=n).name=o.value;else {var c=it({name:o.value,parent:r});r.children.push(c),r=c;}break;case rt.closeTag:var s=r.parent;if(t.parentNodes||(r.parent=null),r.name!==o.value)break;t.stream&&s===n&&(n.children=[],r.parent=null),t.emitTopLevelOnly&&s!==n||(i.emit(t.tagPrefix+r.name,r),i.emit("tag",r.name,r)),r===n&&(e.removeAllListeners("data"),i.emit(t.doneEvent,r),n=null),r=s;break;case rt.text:r&&r.children.push(it({type:at.text,value:o.value,parent:t.parentNodes?r:null}));break;case rt.attributeName:a=o.value,r.attributes[a]="";break;case rt.attributeValue:r.attributes[a]=o.value;}};return i.reset=function(){(e=nt({debug:t.debug})).on("data",o),n=it(),r=null,a="",i.parse=e.write;},i.reset(),i},ct=function(t,e){e=Object.assign({},e,{stream:!1,tagPrefix:":"});var n=ot(e),r=void 0;return n.on("done",(function(t){r=t;})),n.parse(t),r},st=function(t){var e=ct("<root>".concat(t,"</root>"),{parentNodes:!1});if(e.children&&e.children.length>0&&e.children.every((function(t){return "svg"===t.name})))return 1===e.children.length?e.children[0]:e.children;throw Error("nothing to parse")},ut=function(t){return L(t,["parent"])},lt=function(t){return Z(t,(function(t){return pt(t)?t:ft(t)}))},ft=function(t){return t.replace(/[-|:]([a-z])/gi,(function(t,e){return e.toUpperCase()}))},pt=function(t){return /^(data|aria)(-\w+)/.test(t)},ht=function(t){if(t){var e=String(t);return /[&<>]/.test(e)?"<![CDATA[".concat(e.replace(/]]>/,"]]]]><![CDATA[>"),"]]>"):e}return ""},dt=function(t){return String(t).replace(/&/g,"&amp;").replace(/'/g,"&apos;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},vt=function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=n.transformAttr,a=void 0===r?function(t,e,n){return "".concat(t,'="').concat(n(e),'"')}:r,i=n.transformNode,o=void 0===i?function(t){return t}:i,c=n.selfClose,s=void 0===c||c;if(Array.isArray(e))return e.map((function(e){return t(e,{transformAttr:a,selfClose:s,transformNode:o})})).join("");var u=o(e);if("text"===u.type)return ht(u.value);var l="";for(var f in u.attributes){var p=a(f,u.attributes[f],dt,u.name);l+=p?" ".concat(p):"";}return u.children&&u.children.length>0||!s?"<".concat(u.name).concat(l,">").concat(t(u.children,{transformAttr:a,transformNode:o,selfClose:s}),"</").concat(u.name,">"):"<".concat(u.name).concat(l,"/>")},gt=function(){function t(){a(this,t);}return o(t,null,[{key:"parse",value:function(t){return "string"==typeof t?function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.transformNode,r=void 0===n?function(t){return t}:n,a=e.camelcase,i=void 0!==a&&a;return function(t){var e;return e=ut(t),e=r(e),i&&(e=lt(e)),e}(st(t))}(t):t}},{key:"stringify",value:function(t){return "string"==typeof t?t:vt(t)}}]),t}();function bt(t){return t.replace(/&/g,"&amp;").replace(/'/g,"&apos;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}var mt=Object.freeze({__proto__:null,xml:bt}),yt={type:"object",$schema:"http://json-schema.org/draft-07/schema#",title:"Options",properties:{seed:{title:"Seed",type:"string"},s:{title:"Seed",type:"string"},base64:{title:"Base64",description:"@deprecated use dataUri instead",type:"boolean",default:!1},dataUri:{title:"Data URI",type:"boolean",default:!1},userAgent:{title:"User Agent",description:"@deprecated",type:"string"},flip:{title:"Flip",type:"boolean",default:!1},rotate:{title:"Rotate",type:"integer",minimum:0,maximum:360,default:0},scale:{title:"Scale",type:"integer",minimum:0,maximum:200,default:100},radius:{title:"Radius",type:"integer",minimum:0,maximum:50,default:0},r:{title:"Radius",type:"integer",minimum:0,maximum:50,default:0},width:{title:"Width",description:"@deprecated use size instead",type:"integer",minimum:1},w:{title:"Width",description:"@deprecated use size instead",type:"integer",minimum:1},height:{title:"Height",description:"@deprecated use size instead",type:"integer",minimum:1},h:{title:"Height",description:"@deprecated use size instead",type:"integer",minimum:1},size:{title:"Size",type:"integer",minimum:1},margin:{title:"Margin",description:"@deprecated use scale instead",type:"integer",minimum:0,maximum:25,default:0},m:{title:"Margin",description:"@deprecated use scale instead",type:"integer",minimum:0,maximum:25,default:0},backgroundColor:{title:"Background Color",anyOf:[{type:"string",pattern:"^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$"},{type:"string",pattern:"^[0-9a-zA-Z]+$"},{type:"array",items:{anyOf:[{type:"string",pattern:"^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$"},{type:"string",pattern:"^[0-9a-zA-Z]+$"}]}}]},background:{title:"Background Color",anyOf:[{type:"string",pattern:"^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$"},{type:"string",pattern:"^[0-9a-zA-Z]+$"},{type:"array",items:{anyOf:[{type:"string",pattern:"^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$"},{type:"string",pattern:"^[0-9a-zA-Z]+$"}]}}],description:"@deprecated use backgroundColor instead"},b:{title:"Background Color",anyOf:[{type:"string",pattern:"^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$"},{type:"string",pattern:"^[0-9a-zA-Z]+$"},{type:"array",items:{anyOf:[{type:"string",pattern:"^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$"},{type:"string",pattern:"^[0-9a-zA-Z]+$"}]}}]},translateX:{title:"Translate X%",type:"integer",minimum:-100,maximum:100,default:0},translateY:{title:"Translate Y%",type:"integer",minimum:-100,maximum:100,default:0}},additionalProperties:!1};function At(t){return t.properties||{}}function Ft(t){var e={},n=At(t);return Object.keys(n).forEach((function(t){var a=n[t];"object"===r(a)&&void 0!==a.default&&(e[t]=a.default);})),e}function wt(t){var e={},n=At(t);return Object.keys(n).forEach((function(t){var a=n[t];if("object"===r(a)){var i=a.title;i&&(e[i]=e[i]||[],e[i].push(t));}})),Object.values(e).filter((function(t){return t.length>1})).map((function(t){return t.sort().sort((function(t,e){return t.length===e.length?0:t.length>e.length?1:-1}))}))}function Et(t){var e,n=new Map,r=d(wt(t));try{for(r.s();!(e=r.n()).done;){var a,i=u(e.value.reverse()),o=i[0],c=d(i.slice(1));try{for(c.s();!(a=c.n()).done;){var s=a.value;n.set(s,o);}}catch(t){c.e(t);}finally{c.f();}}}catch(t){r.e(t);}finally{r.f();}return n}var _t=Object.freeze({__proto__:null,properties:At,defaults:Ft,aliases:wt,aliasesMap:Et});function Ct(t,e){return t[e],s(t,[e].map(v))}var xt=Object.freeze({__proto__:null,omit:Ct});function jt(t,e){var n=[{seed:Math.random().toString(),userAgent:"undefined"!=typeof window&&window.navigator&&window.navigator.userAgent},Ft(yt),Ft(t.schema),e],r=Bt(t);return n.forEach((function(t){r=Object.assign(r,Ct(t,"_aliases"));})),r}function Bt(t){var e=new Map([].concat(l(Array.from(Et(yt))),l(Array.from(Et(t.schema)))));return new Proxy({_aliases:e},{get:function(t,e){var n,r=null!==(n=t._aliases.get(e))&&void 0!==n?n:e;return t[r]},set:function(t,e,n){var r,a=null!==(r=t._aliases.get(e))&&void 0!==r?r:e;return t[a]=n,!0},deleteProperty:function(t,e){var n,r=null!==(n=t._aliases.get(e))&&void 0!==n?n:e;return delete t[r],!0}})}var Ot=Object.freeze({__proto__:null,merge:jt,createAliasProxy:Bt}),kt={by:{permits:["Reproduction","Distribution","DerivativeWorks"],requires:["Notice","Attribution"],prohibits:[]},"by-sa":{permits:["Reproduction","Distribution","DerivativeWorks"],requires:["Notice","Attribution","ShareAlike"],prohibits:[]},"by-nd":{permits:["Reproduction","Distribution"],requires:["Notice","Attribution"],prohibits:[]},"by-nc":{permits:["Reproduction","Distribution","DerivativeWorks"],requires:["Notice","Attribution"],prohibits:["CommercialUse"]},"by-nc-sa":{permits:["Reproduction","Distribution","DerivativeWorks"],requires:["Notice","Attribution","ShareAlike"],prohibits:["CommercialUse"]},"by-nc-nd":{permits:["Reproduction","Distribution"],requires:["Notice","Attribution"],prohibits:["CommercialUse"]},zero:{permits:["Reproduction","Distribution","DerivativeWorks"],requires:[],prohibits:[]}};function Dt(){return {"xmlns:dc":"http://purl.org/dc/elements/1.1/","xmlns:cc":"http://creativecommons.org/ns#","xmlns:rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","xmlns:svg":"http://www.w3.org/2000/svg",xmlns:"http://www.w3.org/2000/svg"}}function St(t){return '\n<metadata>\n<rdf:RDF>\n<cc:Work>\n<dc:format>image/svg+xml</dc:format>\n<dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />\n'.concat(Nt(t),"\n").concat(Mt(t),"\n").concat(Tt(t),"\n").concat(Pt(t),"\n").concat(zt(t),"\n</cc:Work>\n").concat(Rt(t),"\n</rdf:RDF>\n</metadata>\n")}function Nt(t){return t.meta.title?"<dc:title>".concat(t.meta.title,"</dc:title>"):""}function Mt(t){if(t.meta.creator){var e=Array.isArray(t.meta.creator)?t.meta.creator:[t.meta.creator];return "\n<dc:creator>\n".concat(It(e),"\n</dc:creator>\n")}return ""}function Tt(t){return t.meta.source?"<dc:source>".concat(t.meta.source,"</dc:source>"):""}function Pt(t){return t.meta.license?'<cc:license rdf:resource="'.concat(t.meta.license.url,'" />'):""}function zt(t){if(t.meta.contributor){var e=Array.isArray(t.meta.contributor)?t.meta.contributor:[t.meta.contributor];return "\n<dc:contributor>\n".concat(It(e),"\n</dc:contributor>\n")}return ""}function It(t){return t.map((function(t){return "\n<cc:Agent>\n<dc:title>".concat(t,"</dc:title>\n</cc:Agent>\n")}))}function Rt(t){var e,n=null===(e=t.meta.license)||void 0===e?void 0:e.url.match(/^https?:\/\/creativecommons.org\/(?:licenses|publicdomain)\/([a-z\-]+)\/\d.\d\//);if(n){var r=kt[n[1]];if(r){var a,i="";return r.permits.forEach((function(t){i+='<cc:permits rdf:resource="https://creativecommons.org/ns#'.concat(t,'" />');})),r.requires.forEach((function(t){i+='<cc:requires rdf:resource="https://creativecommons.org/ns#'.concat(t,'" />');})),r.prohibits.forEach((function(t){i+='<cc:prohibits rdf:resource="https://creativecommons.org/ns#'.concat(t,'" />');})),'\n<cc:License rdf:about="'.concat(null===(a=t.meta.license)||void 0===a?void 0:a.url,'">\n').concat(i,"\n</cc:License>\n")}}return ""}function Lt(t){var e=t.attributes.viewBox.split(" ");return {x:parseInt(e[0]),y:parseInt(e[1]),width:parseInt(e[2]),height:parseInt(e[3])}}function qt(t,e){var n;return Wt(t,100-2*("number"==typeof e?e:null!==(n=e.margin)&&void 0!==n?n:0))}function Vt(t,e){var n,r=Lt(t),a=r.width,i=r.height,o=r.x,c=r.y,s="string"==typeof e?e:null!==(n=e.backgroundColor)&&void 0!==n?n:"transparent";return '\n<rect fill="'.concat(s,'" width="').concat(a,'" height="').concat(i,'" x="').concat(o,'" y="').concat(c,'" />\n').concat(t.body,"\n")}function Wt(t,e){var n=Lt(t),r=n.width,a=n.height,i=n.x,o=e?(e-100)/100:0,c=(a/2+n.y)*o*-1;return '\n<g transform="translate('.concat((r/2+i)*o*-1," ").concat(c,") scale(").concat(e/100,')">\n').concat(t.body,"\n</g>\n")}function Ut(t,e,n){var r=Lt(t),a=(r.width+2*r.x)*((null!=e?e:0)/100),i=(r.height+2*r.y)*((null!=n?n:0)/100);return '\n<g transform="translate('.concat(a," ").concat(i,')">\n').concat(t.body,"\n</g>\n")}function $t(t,e){var n=Lt(t),r=n.width,a=n.height,i=n.x,o=n.y;return '\n<g transform="rotate('.concat(e,", ").concat(r/2+i,", ").concat(a/2+o,')">\n').concat(t.body,"\n</g>\n")}function Ht(t){var e=Lt(t),n=e.width,r=e.x;return '\n<g transform="scale(-1 1) translate('.concat(-1*n-2*r,' 0)">\n').concat(t.body,"\n</g>\n")}function Zt(t,e){var n=Lt(t),r=n.width,a=n.height,i=n.x,o=n.y,c=e?r*e/100:0,s=e?a*e/100:0;return '\n<mask id="avatarsRadiusMask">\n<rect width="'.concat(r,'" height="').concat(a,'" rx="').concat(c,'" ry="').concat(s,'" x="').concat(i,'" y="').concat(o,'" fill="#fff" />\n</mask>\n<g mask="url(#avatarsRadiusMask)">').concat(t.body,"</g>\n")}function Xt(t){return t=n(n({},{"xmlns:dc":"http://purl.org/dc/elements/1.1/","xmlns:cc":"http://creativecommons.org/ns#","xmlns:rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","xmlns:svg":"http://www.w3.org/2000/svg",xmlns:"http://www.w3.org/2000/svg"}),t),Object.keys(t).map((function(e){return "".concat(bt(e),'="').concat(bt(t[e]),'"')})).join(" ")}function Yt(t){return t.trim().replace(/\n/g," ").replace(/>\s+</g,"><").replace(/\s{2,}/g," ").replace(/<([^\/>]+)><\/[^>]+>/gi,"<$1/>").replace(/\s(\/?>)/g,"$1")}var Gt=Object.freeze({__proto__:null,createGroup:function(t){var e=t.children,n=t.x,r=t.y;return '<g transform="translate('.concat(n,", ").concat(r,')">').concat(e,"</g>")},getXmlnsAttributes:Dt,getMetadata:St,getMetadataWorkTitle:Nt,getMetadataWorkCreator:Mt,getMetadataWorkSource:Tt,getMetadataWorkLicense:Pt,getMetadataWorkContributor:zt,getMetadataWorkAgents:It,getMetadataLicense:Rt,getViewBox:Lt,addMargin:qt,addRadius:function(t,e){return void 0===e.radius?t.body:Zt(t,e.radius)},addBackgroundColor:Vt,addScale:Wt,addTranslate:Ut,addRotate:$t,addFlip:Ht,addViewboxMask:Zt,createAttrString:Xt,removeWhitespace:Yt});var Jt=Object.freeze({__proto__:null,createLegacyWrapper:function(t){return function(e,n){var r;n=Object.assign(n,jt(t,n));var a=t.create({prng:y(e.seed),options:n});return "\n<svg ".concat(Xt(a.attributes),">\n").concat(St(t),"\n").concat(null!==(r=a.head)&&void 0!==r?r:"","\n").concat(a.body,"\n</svg>\n")}}}),Kt=Object.freeze({__proto__:null,escape:mt,options:Ot,prng:A,svg:Gt,style:Jt,schema:_t,helper:xt});function Qt(t){var e,n,r,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=y((a=jt(t,a)).seed),o=t.create({prng:i,options:a});if(a.size?(o.attributes.width=a.size.toString(),o.attributes.height=a.size.toString()):(a.width&&(o.attributes.width=a.width.toString()),a.height&&(o.attributes.height=a.height.toString())),void 0!==a.scale&&100!==a.scale?o.body=Wt(o,a.scale):a.margin&&(o.body=qt(o,a)),a.flip&&(o.body=Ht(o)),a.rotate&&(o.body=$t(o,a.rotate)),(a.translateX||a.translateY)&&(o.body=Ut(o,a.translateX,a.translateY)),a.backgroundColor){var c=Array.isArray(a.backgroundColor)?i.pick(a.backgroundColor):a.backgroundColor;o.body=Vt(o,c);}o.body=Zt(o,null!==(e=a.radius)&&void 0!==e?e:0);var s=Boolean(null===(n=o.head)||void 0===n?void 0:n.match(/<metadata([^>]*)>/)),u=Yt("\n<svg ".concat(Xt(o.attributes),">\n").concat(s?"":St(t),"\n").concat(null!==(r=o.head)&&void 0!==r?r:"","\n").concat(o.body,"\n</svg>\n"));if(a.dataUri)return "data:image/svg+xml;utf8,".concat(encodeURIComponent(u));if(a.base64){var l=encodeURIComponent(u).replace(/%([0-9A-F]{2})/g,(function(t,e){return String.fromCharCode(parseInt("0x".concat(e)))}));return "data:image/svg+xml;base64,".concat(btoa(l))}return u}var te=function(){function t(e,n){a(this,t),c(this,"spriteCollection",void 0),c(this,"defaultOptions",void 0),this.spriteCollection=e,this.defaultOptions=n;}return o(t,[{key:"create",value:function(t,e){var r=this;return Qt({meta:{},schema:{},create:function(t){var e=t.prng,n=t.options,a=gt.parse(r.spriteCollection(new F(e.seed),n)),i=[],o=[];return a.children.forEach((function(t){r.isBody(t)?o.push(t):i.push(t);})),{attributes:a.attributes,head:i.map((function(t){return gt.stringify(t)})).join(""),body:o.map((function(t){return gt.stringify(t)})).join("")}}},n(n(n({},this.defaultOptions),e),{},{seed:t}))}},{key:"isBody",value:function(t){return "element"===t.type&&-1===["title","desc","defs","metadata"].indexOf(t.name)}}]),t}();c(te,"random",F),c(te,"color",O),c(te,"parser",gt),t.color=k,t.createAvatar=Qt,t.default=te,t.schema=yt,t.utils=Kt,Object.defineProperty(t,"__esModule",{value:!0});}));
    });

    var index_umd = createCommonjsModule(function (module, exports) {
    !function(l,e){e(exports,index_umd$2);}(commonjsGlobal,(function(l,e){function a(l,e,a){var c=a.mode||"include",n=a[l];if(Array.isArray(n))switch(c){case"include":return -1!==n.indexOf(e);case"exclude":return -1===n.indexOf(e)}return !0}var c={kurt:function(l){return '\n<path d="M71 15.111c-11.038 0-12.63-9.084-35.33-10.37C12.985 3.717 5.815 10.45 5.776 15.11c.037 4.293-1.128 15.45 13.588 28.519 14.773 15.512 29.906 10.252 35.33 5.185C60.135 46.473 66.34 25.46 71 25.482c4.66.021 10.865 20.991 16.306 23.333 5.423 5.067 20.557 10.327 35.329-5.185 14.717-13.069 13.552-24.226 13.588-28.519-.038-4.662-7.209-11.394-29.894-10.37-22.7 1.286-24.292 10.37-35.33 10.37z" fill="#000" fill-opacity=".1"/>\n<path d="M71 13.111c-11.038 0-12.63-9.084-35.33-10.37C12.985 1.717 5.815 8.449 5.776 13.11c.037 4.293-1.128 15.45 13.588 28.519 14.773 15.512 29.906 10.252 35.33 5.185C60.135 44.473 66.34 23.46 71 23.482c4.66.021 10.865 20.991 16.306 23.333 5.423 5.067 20.557 10.327 35.329-5.185 14.717-13.069 13.552-24.226 13.588-28.519-.038-4.662-7.209-11.394-29.894-10.37-22.7 1.286-24.292 10.37-35.33 10.37z" fill="'.concat(l,'"/>\n<path d="M32.953 7.926c14.262-.284 27.557 7.897 27.176 15.555-.22 5.053-2.932 22.825-19.023 23.334-16.092.489-24.808-17.793-24.46-25.926.195-3.51 2.051-12.664 16.307-12.963zm76.094 0C94.784 7.642 81.49 15.823 81.871 23.48c.22 5.053 2.932 22.825 19.023 23.334 16.091.489 24.808-17.793 24.459-25.926-.195-3.51-2.05-12.664-16.306-12.963z" fill="#2F383B"/>\n')},prescription01:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M111.712 10.488c4.666.16 8 .887 10.548 4.518 3.012.156 6.253.374 8.981 1.633 3.385 1.562 3.908 5.1-.359 5.587-1.859.213-3.72-.12-5.552-.448l-.186-.033a9.348 9.348 0 00-.339-.054c1.104 9.461-6.207 20.869-14.228 24.346-10.977 4.76-23.24-.508-29.043-10.033-2.626-4.31-4.142-10.515-4.466-15.86-.42-.204-.83-.441-1.23-.674-.38-.22-.754-.437-1.119-.615-2.007-.978-5.338-1.098-7.506 0-.338.172-.685.374-1.039.582-.426.25-.864.505-1.313.722-.325 5.343-1.841 11.54-4.465 15.847-5.804 9.526-18.067 14.793-29.044 10.033-8.021-3.477-15.333-14.886-14.227-24.348a9.563 9.563 0 00-.338.054l-.185.033c-1.833.328-3.694.66-5.553.448-4.267-.487-3.744-4.025-.359-5.587 2.728-1.259 5.969-1.477 8.982-1.633 2.547-3.63 5.881-4.355 10.546-4.515l23.291-.457c5.189-.14 9.718-.01 11.033 4.606 2.089-.814 4.505-1.255 6.35-1.255 1.858 0 4.348.447 6.49 1.274 1.306-4.638 5.842-4.767 11.039-4.627l23.291.456zm-24.031 6.785c-2.372.022-3.493.416-3.897 2.89-.41 2.505-.012 5.322.46 7.79.721 3.767 1.92 7.459 4.708 10.213 1.47 1.45 3.261 2.606 5.167 3.396 1.012.419 2.081.722 3.15.951.114.025.544.09.963.153.626.094 1.228.185.711.131l-.095-.01-.065-.007a47.075 47.075 0 01.16.017c3.724.397 7.719.312 10.814-2.047 3.533-2.692 5.952-6.952 7.016-11.196.623-2.483 1.93-8.422-.459-10.407-2.737-2.275-28.633-1.874-28.633-1.874zm-33.432.002c2.372.023 3.493.417 3.897 2.89.41 2.506.011 5.322-.46 7.79-.721 3.768-1.92 7.46-4.708 10.214-1.47 1.45-3.261 2.606-5.167 3.395-1.012.42-2.081.722-3.15.952-.114.024-.544.09-.962.152-.64.097-1.255.19-.678.128-3.734.4-7.743.323-10.849-2.044-3.532-2.692-5.952-6.952-7.015-11.196-.623-2.483-1.93-8.422.459-10.407 2.737-2.274 28.633-1.874 28.633-1.874zM43.318 42.764z" fill="#000" fill-opacity=".1"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M111.712 8.488c4.666.16 8 .887 10.548 4.518 3.012.156 6.253.374 8.981 1.633 3.385 1.562 3.908 5.1-.359 5.587-1.859.213-3.72-.12-5.552-.448l-.186-.033a9.348 9.348 0 00-.339-.054c1.104 9.461-6.207 20.869-14.228 24.346-10.977 4.76-23.24-.508-29.043-10.033-2.626-4.31-4.142-10.515-4.466-15.86-.42-.204-.83-.441-1.23-.674-.38-.22-.754-.437-1.119-.615-2.007-.978-5.338-1.098-7.506 0-.338.172-.685.374-1.039.582-.426.25-.864.505-1.313.722-.325 5.343-1.841 11.54-4.465 15.847-5.804 9.526-18.067 14.793-29.044 10.033-8.021-3.477-15.333-14.886-14.227-24.348a9.563 9.563 0 00-.338.054l-.185.033c-1.833.328-3.694.66-5.553.448-4.267-.487-3.744-4.025-.359-5.587 2.728-1.259 5.969-1.477 8.982-1.633 2.547-3.63 5.881-4.355 10.546-4.515l23.291-.457c5.189-.14 9.718-.01 11.033 4.606 2.089-.814 4.505-1.255 6.35-1.255 1.858 0 4.348.447 6.49 1.274 1.306-4.638 5.842-4.767 11.039-4.627l23.291.456zm-24.031 6.785c-2.372.022-3.493.416-3.897 2.89-.41 2.505-.012 5.322.46 7.79.721 3.767 1.92 7.459 4.708 10.213 1.47 1.45 3.261 2.606 5.167 3.396 1.012.419 2.081.722 3.15.951.114.025.544.09.963.153.626.094 1.228.185.711.131l-.095-.01-.065-.007a47.075 47.075 0 01.16.017c3.724.397 7.719.312 10.814-2.047 3.533-2.692 5.952-6.952 7.016-11.196.623-2.483 1.93-8.422-.459-10.407-2.737-2.275-28.633-1.874-28.633-1.874zm-33.432.002c2.372.022 3.493.417 3.897 2.89.41 2.506.011 5.322-.46 7.79-.721 3.768-1.92 7.46-4.708 10.214-1.47 1.45-3.261 2.606-5.167 3.395-1.012.42-2.081.722-3.15.952-.114.024-.544.09-.962.152-.64.097-1.255.19-.678.128-3.734.4-7.743.323-10.849-2.044-3.532-2.692-5.952-6.952-7.015-11.196-.623-2.483-1.93-8.422.459-10.407 2.737-2.275 28.633-1.874 28.633-1.874zM43.318 40.764z" fill="'.concat(l,'"/>\n')},prescription02:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M38.5 9C17.21 9 9.646 14.096 8.955 14.772 7.324 14.772 6 16.062 6 17.657v2.886c0 1.596 1.324 2.886 2.955 2.886 0 0 5.909 0 5.909 2.886 0 .435.067.644.181.68A62.59 62.59 0 0015 29.5C15 42.336 23.315 50 37.242 50H40c14.721 0 25-8.431 25-20.5 0-1.502-.038-2.999-.17-4.46l1.583-.773a7.917 7.917 0 011.891-.633c1.855-.38 3.952-.227 5.992.276.732.18 1.26.354 1.504.45l1.381.547C77.041 26.41 77 27.953 77 29.5 77 42.336 85.315 50 99.242 50H102c14.721 0 25-8.431 25-20.5 0-1.536-.04-3.067-.178-4.56 1.739-1.511 6.223-1.511 6.223-1.511 1.634 0 2.955-1.29 2.955-2.886v-2.886c0-1.596-1.321-2.885-2.955-2.885C132.354 14.096 124.79 9 103.5 9h-2.97c-1.79 0-3.445.069-4.975.201-9.533.539-14.679 2.15-19.913 4.696a17.01 17.01 0 01-4.563.869c-2.379-.076-4.412-.767-4.81-.908l-.419-.206-.006-.003c-4.935-2.415-8.429-4.125-20.772-4.547A61.165 61.165 0 0041.47 9H38.5zM19 30.502C19 21.84 19 15 38.385 15h3.23C61 15 61 21.841 61 30.502 61 39.627 52.365 46 40 46h-3.03C22.117 46 19 37.572 19 30.502zm62 0C81 21.84 81 15 100.385 15h3.23C123 15 123 21.841 123 30.502 123 39.627 114.365 46 102 46h-3.03C84.12 46 81 37.572 81 30.502z" fill="#000" fill-opacity=".1"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M38.5 7C17.21 7 9.646 12.096 8.955 12.772 7.324 12.772 6 14.062 6 15.657v2.886c0 1.596 1.324 2.886 2.955 2.886 0 0 5.909 0 5.909 2.886 0 .435.067.644.181.68A62.59 62.59 0 0015 27.5C15 40.336 23.315 48 37.242 48H40c14.721 0 25-8.431 25-20.5 0-1.502-.038-2.999-.17-4.46l1.583-.773a7.917 7.917 0 011.891-.633c1.855-.38 3.952-.227 5.992.276.732.18 1.26.354 1.504.45l1.381.547C77.041 24.41 77 25.953 77 27.5 77 40.336 85.315 48 99.242 48H102c14.721 0 25-8.431 25-20.5 0-1.536-.04-3.067-.178-4.56 1.739-1.511 6.223-1.511 6.223-1.511 1.634 0 2.955-1.29 2.955-2.886v-2.886c0-1.595-1.321-2.885-2.955-2.885C132.354 12.096 124.79 7 103.5 7h-2.97c-1.79 0-3.445.069-4.975.2-9.533.54-14.679 2.152-19.913 4.697a17.01 17.01 0 01-4.563.869c-2.379-.076-4.412-.767-4.81-.908l-.419-.206-.006-.003c-4.935-2.415-8.429-4.125-20.772-4.547A61.165 61.165 0 0041.47 7H38.5zM19 28.502C19 19.84 19 13 38.385 13h3.23C61 13 61 19.841 61 28.502 61 37.627 52.365 44 40 44h-3.03C22.117 44 19 35.572 19 28.502zm62 0C81 19.84 81 13 100.385 13h3.23C123 13 123 19.841 123 28.502 123 37.627 114.365 44 102 44h-3.03C84.12 44 81 35.572 81 28.502z" fill="'.concat(l,'"/>\n')},round:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M40 53c-13.255 0-24-10.745-24-24 0-2.435.363-4.785 1.037-7H10.5a2.5 2.5 0 010-5h8c.229 0 .45.03.66.088C23.297 9.866 31.08 5 40 5c9.352 0 17.455 5.35 21.416 13.155C63.493 15.039 66.949 13 70.862 13c4.013 0 7.545 2.144 9.603 5.394C84.38 10.46 92.553 5 102 5c8.92 0 16.703 4.866 20.84 12.088a2.52 2.52 0 01.66-.088h8a2.5 2.5 0 110 5h-6.537A24.006 24.006 0 01126 29c0 13.255-10.745 24-24 24S78 42.255 78 29c0-1.422.124-2.815.36-4.169C78.277 20.455 74.915 17 70.863 17c-3.736 0-6.887 2.94-7.42 6.83.365 1.665.558 3.395.558 5.17 0 13.255-10.745 24-24 24zm0-4c11.046 0 20-8.954 20-20S51.046 9 40 9s-20 8.954-20 20 8.954 20 20 20zm82-20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z" fill="#000" fill-opacity=".1"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M40 51c-13.255 0-24-10.745-24-24 0-2.435.363-4.785 1.037-7H10.5a2.5 2.5 0 010-5h8c.229 0 .45.03.66.088C23.297 7.866 31.08 3 40 3c9.352 0 17.455 5.35 21.416 13.155C63.493 13.039 66.949 11 70.862 11c4.013 0 7.545 2.144 9.603 5.394C84.38 8.46 92.553 3 102 3c8.92 0 16.703 4.866 20.84 12.088a2.52 2.52 0 01.66-.088h8a2.5 2.5 0 110 5h-6.537A24.006 24.006 0 01126 27c0 13.255-10.745 24-24 24S78 40.255 78 27c0-1.422.124-2.815.36-4.169C78.277 18.455 74.915 15 70.863 15c-3.736 0-6.887 2.94-7.42 6.83.365 1.665.558 3.395.558 5.17 0 13.255-10.745 24-24 24zm0-4c11.046 0 20-8.954 20-20S51.046 7 40 7s-20 8.954-20 20 8.954 20 20 20zm82-20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z" fill="'.concat(l,'"/>\n')},sunglasses:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M111.712 10.488c4.666.16 8 .887 10.548 4.519 3.012.155 6.253.373 8.981 1.632 3.385 1.562 3.908 5.1-.359 5.587-1.859.213-3.72-.12-5.552-.448l-.186-.033a9.133 9.133 0 00-.339-.054c1.104 9.461-6.207 20.869-14.228 24.346-10.977 4.76-23.24-.508-29.043-10.033-2.626-4.31-4.142-10.515-4.466-15.86-.42-.204-.83-.441-1.23-.673a18.141 18.141 0 00-1.119-.616c-2.007-.978-5.338-1.098-7.506 0a20.01 20.01 0 00-1.039.582c-.426.25-.864.505-1.313.722-.325 5.343-1.841 11.54-4.465 15.847-5.804 9.526-18.067 14.793-29.044 10.033-8.021-3.477-15.333-14.886-14.227-24.348a9.336 9.336 0 00-.338.054l-.185.033c-1.833.328-3.694.66-5.553.448-4.267-.487-3.744-4.025-.359-5.587 2.728-1.259 5.969-1.476 8.982-1.633 2.547-3.63 5.881-4.355 10.546-4.515l23.291-.457c5.189-.14 9.718-.01 11.033 4.606 2.089-.814 4.505-1.255 6.35-1.255 1.858 0 4.348.448 6.49 1.274 1.306-4.638 5.842-4.767 11.039-4.627l23.291.456zm-24.031 6.785c-2.372.022-3.493.416-3.897 2.89-.41 2.505-.012 5.322.46 7.79.721 3.767 1.92 7.459 4.708 10.213 1.47 1.45 3.261 2.606 5.167 3.396 1.012.419 2.081.722 3.15.951.114.025.544.09.963.153.626.094 1.228.185.711.132 3.724.396 7.719.311 10.814-2.048 3.533-2.692 5.952-6.952 7.016-11.196.623-2.483 1.93-8.422-.459-10.407-2.737-2.275-28.633-1.874-28.633-1.874zm-33.432.002c2.372.023 3.493.417 3.897 2.89.41 2.506.011 5.322-.46 7.79-.721 3.768-1.92 7.46-4.708 10.214-1.47 1.45-3.261 2.606-5.167 3.395-1.012.42-2.081.722-3.15.952-.114.024-.544.09-.962.152-.64.097-1.255.19-.678.128-3.734.4-7.743.323-10.849-2.044-3.532-2.692-5.952-6.952-7.015-11.196-.623-2.483-1.93-8.422.459-10.407 2.737-2.274 28.633-1.874 28.633-1.874zM43.318 42.764z" fill="#000" fill-opacity=".1"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M55.01 14.277c2.512.024 3.698.45 4.126 3.115.434 2.7.012 5.736-.488 8.395-.762 4.06-2.03 8.04-4.983 11.008-1.556 1.563-3.453 2.808-5.47 3.66-1.072.451-2.204.777-3.335 1.025-.33.072-3.154.468-1.422.267-4.041.47-8.425.45-11.8-2.168-3.74-2.901-6.301-7.493-7.427-12.066-.66-2.676-2.044-9.076.486-11.216 2.898-2.452 30.314-2.02 30.314-2.02z" fill="#000" fill-opacity=".7"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M55.01 14.277c2.512.024 3.698.45 4.126 3.115.434 2.7.012 5.736-.488 8.395-.762 4.06-2.03 8.04-4.983 11.008-1.556 1.563-3.453 2.808-5.47 3.66-1.072.451-2.204.777-3.335 1.025-.33.072-3.154.468-1.422.267-4.041.47-8.425.45-11.8-2.168-3.74-2.901-6.301-7.493-7.427-12.066-.66-2.676-2.044-9.076.486-11.216 2.898-2.452 30.314-2.02 30.314-2.02z" fill="url(#Top/_Resources/Sunglasses__paint0_linear)" style="mix-blend-mode:screen"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M86.92 14.275c-2.512.024-3.699.449-4.126 3.114-.434 2.7-.012 5.736.487 8.395.763 4.061 2.032 8.04 4.984 11.008 1.556 1.563 3.453 2.809 5.47 3.66 1.072.451 2.204.778 3.335 1.025.33.072 3.153.469 1.422.267 4.041.47 8.425.45 11.799-2.167 3.741-2.902 6.302-7.493 7.428-12.066.659-2.677 2.043-9.077-.486-11.217-2.898-2.451-30.314-2.02-30.314-2.02z" fill="#000" fill-opacity=".7"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M86.92 14.275c-2.512.024-3.699.449-4.126 3.114-.434 2.7-.012 5.736.487 8.395.763 4.061 2.032 8.04 4.984 11.008 1.556 1.563 3.453 2.809 5.47 3.66 1.072.451 2.204.778 3.335 1.025.33.072 3.153.469 1.422.267 4.041.47 8.425.45 11.799-2.167 3.741-2.902 6.302-7.493 7.428-12.066.659-2.677 2.043-9.077-.486-11.217-2.898-2.451-30.314-2.02-30.314-2.02z" fill="url(#Top/_Resources/Sunglasses__paint1_linear)" style="mix-blend-mode:screen"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M111.712 8.488c4.666.16 8 .887 10.548 4.519 3.012.155 6.253.373 8.981 1.632 3.385 1.562 3.908 5.1-.359 5.587-1.859.213-3.72-.12-5.552-.448l-.186-.033a9.133 9.133 0 00-.339-.054c1.104 9.461-6.207 20.869-14.228 24.346-10.977 4.76-23.24-.508-29.043-10.033-2.626-4.31-4.142-10.515-4.466-15.86-.42-.204-.83-.441-1.23-.673a18.141 18.141 0 00-1.119-.616c-2.007-.978-5.338-1.098-7.506 0a20.01 20.01 0 00-1.039.582c-.426.25-.864.505-1.313.722-.325 5.343-1.841 11.54-4.465 15.847-5.804 9.526-18.067 14.793-29.044 10.033-8.021-3.477-15.333-14.886-14.227-24.348a9.336 9.336 0 00-.338.054l-.185.033c-1.833.328-3.694.66-5.553.448-4.267-.487-3.744-4.025-.359-5.587 2.728-1.259 5.969-1.476 8.982-1.633 2.547-3.63 5.881-4.355 10.546-4.516l23.291-.456c5.189-.14 9.718-.01 11.033 4.606 2.089-.814 4.505-1.255 6.35-1.255 1.858 0 4.348.448 6.49 1.274 1.306-4.638 5.842-4.767 11.039-4.627l23.291.456zm-24.031 6.785c-2.372.022-3.493.416-3.897 2.89-.41 2.505-.012 5.322.46 7.79.721 3.767 1.92 7.459 4.708 10.213 1.47 1.45 3.261 2.606 5.167 3.396 1.012.419 2.081.722 3.15.951.114.025.544.09.963.153.626.094 1.228.185.711.132 3.724.396 7.719.311 10.814-2.048 3.533-2.692 5.952-6.952 7.016-11.196.623-2.483 1.93-8.422-.459-10.407-2.737-2.275-28.633-1.874-28.633-1.874zm-33.432.002c2.372.022 3.493.417 3.897 2.89.41 2.506.011 5.322-.46 7.79-.721 3.768-1.92 7.46-4.708 10.214-1.47 1.45-3.261 2.606-5.167 3.395-1.012.42-2.081.722-3.15.952-.114.024-.544.09-.962.152-.64.097-1.255.19-.678.128-3.734.4-7.743.323-10.849-2.044-3.532-2.692-5.952-6.952-7.015-11.196-.623-2.483-1.93-8.422.459-10.407 2.737-2.275 28.633-1.874 28.633-1.874zM43.318 40.763z" fill="'.concat(l,'"/>\n<defs>\n<linearGradient id="Top/_Resources/Sunglasses__paint0_linear" x1="28.557" y1="14.248" x2="28.557" y2="33.801" gradientUnits="userSpaceOnUse">\n<stop stop-color="#fff" stop-opacity=".5"/>\n<stop offset="1" stop-opacity=".5"/>\n</linearGradient>\n<linearGradient id="Top/_Resources/Sunglasses__paint1_linear" x1="82.613" y1="14.245" x2="82.613" y2="41.978" gradientUnits="userSpaceOnUse">\n<stop stop-color="#fff" stop-opacity=".5"/>\n<stop offset=".705" stop-opacity=".5"/>\n</linearGradient>\n</defs>\n')},wayfarers:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M39.25 9c-21.127 0-28.632 5.172-29.318 5.857A2.93 2.93 0 007 17.786v2.928a2.93 2.93 0 002.932 2.929s5.864 0 5.864 2.928c0 .19.012.337.035.447a62.957 62.957 0 00-.044 2.482c0 12.836 8.29 20.5 22.179 20.5h2.75c14.68 0 24.93-8.431 24.93-20.5 0-1.44-.036-2.875-.154-4.28l1.456-.727a7.739 7.739 0 011.877-.642c1.84-.386 3.922-.23 5.946.28.726.183 1.25.36 1.493.458l1.255.507c-.127 1.444-.164 2.921-.164 4.404 0 12.836 8.291 20.5 22.18 20.5h2.749c14.68 0 24.929-8.431 24.929-20.5 0-.83-.011-1.66-.044-2.483.023-.109.036-.256.036-.446 0-2.928 5.863-2.928 5.863-2.928A2.928 2.928 0 00136 20.714v-2.928a2.928 2.928 0 00-2.932-2.929C132.382 14.172 124.877 9 103.75 9h-2.932c-1.831 0-3.52.072-5.079.211-9.379.555-14.462 2.187-19.633 4.759a16.54 16.54 0 01-4.527.881c-2.361-.077-4.38-.778-4.774-.92l-.415-.21-.007-.004c-4.888-2.446-8.35-4.179-20.545-4.612A60.677 60.677 0 0042.182 9H39.25zm-1.117 5.863a192.746 192.746 0 017.599.09c14.05.845 14.05 6.956 14.05 14.547 0 8.622-7.84 14.643-19.066 14.643h-2.75C24.48 44.143 21.65 36.18 21.65 29.5c0-8.006 0-14.365 16.483-14.637zm26.11 4.353l.088.036-.063.031a49.3 49.3 0 00-.026-.067zm14.512.007l-.067.027.05.02.017-.047zm16.705-4.124c2.404-.16 5.134-.242 8.29-.242.378 0 .751.002 1.118.006 16.482.272 16.482 6.632 16.482 14.637 0 8.622-7.84 14.643-19.066 14.643h-2.75c-13.483 0-16.315-7.963-16.315-14.643 0-7.25 0-13.15 12.241-14.4z" fill="#000" fill-opacity=".1"/>\n<path d="M40.716 45.071c13.747 0 21.997-7.869 21.997-17.571 0-9.705-1.284-17.571-20.531-17.571H39.25c-19.248 0-20.532 7.866-20.532 17.571 0 9.7 5.5 17.571 19.248 17.571h2.75z" fill="#000" fill-opacity=".7"/>\n<path d="M40.716 45.071c13.747 0 21.997-7.869 21.997-17.571 0-9.705-1.284-17.571-20.531-17.571H39.25c-19.248 0-20.532 7.866-20.532 17.571 0 9.7 5.5 17.571 19.248 17.571h2.75z" fill="url(#Top/_Resources/Wayfarers__paint0_linear)" style="mix-blend-mode:screen"/>\n<path d="M102.284 45.071c13.75 0 21.997-7.869 21.997-17.571 0-9.705-1.287-17.571-20.531-17.571h-2.932c-19.247 0-20.531 7.866-20.531 17.571 0 9.7 5.5 17.571 19.247 17.571h2.75z" fill="#000" fill-opacity=".7"/>\n<path d="M102.284 45.071c13.75 0 21.997-7.869 21.997-17.571 0-9.705-1.287-17.571-20.531-17.571h-2.932c-19.247 0-20.531 7.866-20.531 17.571 0 9.7 5.5 17.571 19.247 17.571h2.75z" fill="url(#Top/_Resources/Wayfarers__paint1_linear)" style="mix-blend-mode:screen"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M39.25 7c-21.127 0-28.632 5.172-29.318 5.857A2.93 2.93 0 007 15.786v2.928a2.93 2.93 0 002.932 2.929s5.864 0 5.864 2.928c0 .19.012.337.035.447a62.957 62.957 0 00-.044 2.482c0 12.836 8.29 20.5 22.179 20.5h2.75c14.68 0 24.93-8.431 24.93-20.5 0-1.44-.036-2.875-.154-4.28l1.456-.727a7.739 7.739 0 011.877-.642c1.84-.386 3.922-.23 5.946.28.726.183 1.25.36 1.493.458l1.255.507c-.127 1.444-.164 2.921-.164 4.404 0 12.836 8.291 20.5 22.18 20.5h2.749c14.68 0 24.929-8.431 24.929-20.5 0-.83-.011-1.66-.044-2.483.023-.109.036-.256.036-.446 0-2.928 5.863-2.928 5.863-2.928A2.928 2.928 0 00136 18.714v-2.928a2.928 2.928 0 00-2.932-2.929C132.382 12.172 124.877 7 103.75 7h-2.932c-1.831 0-3.52.072-5.079.211-9.379.555-14.462 2.187-19.633 4.759a16.54 16.54 0 01-4.527.881c-2.361-.077-4.38-.778-4.774-.92l-.415-.21-.007-.004c-4.888-2.446-8.35-4.179-20.545-4.612A60.677 60.677 0 0042.182 7H39.25zm-1.117 5.863a192.746 192.746 0 017.599.09c14.05.845 14.05 6.956 14.05 14.547 0 8.622-7.84 14.643-19.066 14.643h-2.75C24.48 42.143 21.65 34.18 21.65 27.5c0-8.006 0-14.365 16.483-14.637zm26.11 4.353l.088.036-.063.031a49.3 49.3 0 00-.026-.067zm14.512.007l-.067.027.05.02.017-.047zm16.705-4.124c2.404-.16 5.134-.242 8.29-.242.378 0 .751.002 1.118.006 16.482.272 16.482 6.632 16.482 14.637 0 8.622-7.84 14.643-19.066 14.643h-2.75c-13.483 0-16.315-7.963-16.315-14.643 0-7.25 0-13.15 12.241-14.4z" fill="'.concat(l,'"/>\n<defs>\n<linearGradient id="Top/_Resources/Wayfarers__paint0_linear" x1="80.287" y1="9.929" x2="80.287" y2="45.071" gradientUnits="userSpaceOnUse">\n<stop stop-color="#fff" stop-opacity=".5"/>\n<stop offset=".705" stop-opacity=".5"/>\n</linearGradient>\n<linearGradient id="Top/_Resources/Wayfarers__paint1_linear" x1="80.287" y1="9.929" x2="80.287" y2="45.071" gradientUnits="userSpaceOnUse">\n<stop stop-color="#fff" stop-opacity=".5"/>\n<stop offset=".705" stop-opacity=".5"/>\n</linearGradient>\n</defs>\n')}},n={blazerAndShirt:function(l){return '\n<path d="M132.5 51.828c18.502 0 33.5-9.617 33.5-21.48 0-.353-.013-.704-.04-1.053 36.976 3.03 66.04 34 66.04 71.757V110H32v-8.948c0-38.1 29.592-69.287 67.045-71.833-.03.374-.045.75-.045 1.129 0 11.863 14.998 21.48 33.5 21.48z" fill="#E6E6E6"/>\n<path d="M132.5 58.761c21.89 0 39.635-12.05 39.635-26.913 0-.603-.029-1.2-.086-1.793a72.056 72.056 0 00-6.089-.76c.027.349.04.7.04 1.053 0 11.863-14.998 21.48-33.5 21.48-18.502 0-33.5-9.617-33.5-21.48 0-.379.015-.755.045-1.128-2.05.139-4.077.364-6.077.672a18.594 18.594 0 00-.103 1.956c0 14.864 17.745 26.913 39.635 26.913z" fill="#000" fill-opacity=".16"/>\n<path d="M100.778 29.122c.072-.378.145-.752.222-1.122-2.959.054-6 1-6 1l-.42.662C59.267 34.276 32 64.48 32 101.052V110h74s-10.7-51.555-5.238-80.793l.023-.085h-.007zM158 110s11-53 5-82c2.959.054 6 1 6 1l.419.662C204.733 34.276 232 64.48 232 101.052V110h-74z" fill="'.concat(l,'"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M101 28c-6 29 5 82 5 82H90L76 74l6-9-6-6 19-30s3.041-.946 6-1zm62 0c6 29-5 82-5 82h16l14-36-6-9 6-6-19-30s-3.041-.946-6-1z" fill="#000" fill-opacity=".15"/>\n<path d="M183.423 85.77l.871-2.24 6.262-4.697a4 4 0 014.856.043L202 84l-18.577 1.77z" fill="#E6E6E6"/>\n')},blazerAndSweater:function(l){return '\n<path d="M132 57.052c14.912 0 27-11.193 27-25 0-1.015-.065-2.017-.192-3H160c39.764 0 72 32.235 72 72V110H32v-8.948c0-39.765 32.236-72 72-72h1.192a23.418 23.418 0 00-.192 3c0 13.807 12.088 25 27 25z" fill="#E6E6E6"/>\n<path d="M100.778 29.122c.072-.378.145-.752.222-1.122-2.959.054-6 1-6 1l-.42.662C59.267 34.276 32 64.48 32 101.052V110h74s-10.7-51.555-5.238-80.793l.023-.085h-.007zM158 110s11-53 5-82c2.959.054 6 1 6 1l.419.662C204.733 34.276 232 64.48 232 101.052V110h-74z" fill="'.concat(l,'"/>\n<path d="M183.423 85.77l.871-2.24 6.262-4.697a4 4 0 014.856.043L202 84l-18.577 1.77z" fill="#E6E6E6"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M101 28c-6 29 5 82 5 82H90L76 74l6-9-6-6 19-30s3.041-.946 6-1zm62 0c6 29-5 82-5 82h16l14-36-6-9 6-6-19-30s-3.041-.946-6-1z" fill="#000" fill-opacity=".15"/>\n<path d="M108 21.539c-6.772 4.597-11 11.117-11 18.349 0 7.4 4.428 14.057 11.48 18.669l5.941-4.68 4.579.33-1-3.15.078-.062C111.978 47.853 108 42.7 108 36.877V21.539zm48 15.338c0 5.823-3.978 10.976-10.078 14.118l.078.062-1 3.15 4.579-.33 5.941 4.68c7.052-4.612 11.48-11.268 11.48-18.67 0-7.23-4.228-13.751-11-18.348v15.338z" fill="#F2F2F2"/>\n')},collarAndSweater:function(l){return '\n<path d="M100.374 29.141c1.88-2.864 4.479-5.43 7.626-7.57v15.306c0 5.823 3.978 10.976 10.078 14.118l-.078.062.909 2.865c3.878 1.994 8.341 3.13 13.091 3.13s9.213-1.136 13.091-3.13l.909-2.865-.078-.062C152.022 47.853 156 42.7 156 36.877V22.279c2.684 1.979 4.923 4.28 6.597 6.819C201.159 30.465 232 62.157 232 101.052V110H32v-8.948c0-38.549 30.294-70.022 68.374-71.91z" fill="'.concat(l,'"/>\n<path d="M108 21.572c-6.767 4.602-11 11.168-11 18.456 0 7.398 4.362 14.052 11.308 18.664l6.113-4.816 4.579.332-1-3.151.078-.062C111.978 47.853 108 42.7 108 36.877V21.57zm48 15.305c0 5.823-3.978 10.976-10.078 14.118l.078.062-1 3.15 4.579-.33 5.65 4.45C161.863 53.733 166 47.234 166 40.027c0-6.921-3.818-13.192-10-17.748v14.598z" fill="#fff" fill-opacity=".75"/>\n')},graphicShirt:function(l,e){return '\n<path d="M132.5 54c18.502 0 33.5-9.626 33.5-21.5a14.08 14.08 0 00-.376-3.232C202.76 32.138 232 63.18 232 101.052V110H32v-8.948c0-38.217 29.775-69.48 67.393-71.855A14.108 14.108 0 0099 32.5C99 44.374 113.998 54 132.5 54z" fill="'.concat(l,'"/>\n').concat(e?'<g transform="translate(77, 58)">'.concat(e,"</g>"):"","\n")},hoodie:function(l){return '\n<path d="M108 14.694C92.484 18.38 80.895 25.529 77.228 34.142 50.72 44.765 32 70.696 32 101v9h200v-9.001c0-30.303-18.721-56.234-45.228-66.858-3.667-8.613-15.256-15.761-30.772-19.447V32c0 13.255-10.745 24-24 24s-24-10.745-24-24V14.694z" fill="'.concat(l,'"/>\n<path d="M102 63.337a67.11 67.11 0 01-7-2.817V110h7V63.337zm60 0a67.039 67.039 0 007-2.817V98.5a3.5 3.5 0 11-7 0V63.337z" fill="#F4F4F4"/>\n<path d="M187.62 34.488a71.788 71.788 0 0110.832 5.628C197.107 55.615 167.87 68 132 68c30.928 0 56-13.431 56-30 0-1.188-.129-2.36-.38-3.512zm-111.24 0A16.477 16.477 0 0076 38c0 16.569 25.072 30 56 30-35.87 0-65.107-12.385-66.452-27.884a71.783 71.783 0 0110.832-5.628z" fill="#000" fill-opacity=".16"/>\n')},overall:function(l){return '\n<path d="M196 38.632V110H68V38.632a71.525 71.525 0 0126-8.944V74h76V29.688a71.523 71.523 0 0126 8.944z" fill="'.concat(l,'"/>\n<path d="M86 83a5 5 0 11-10 0 5 5 0 0110 0zm102 0a5 5 0 11-10 0 5 5 0 0110 0z" fill="#F4F4F4"/>\n')},shirtCrewNeck:function(l){return '\n<path d="M132.5 51.828c18.502 0 33.5-9.617 33.5-21.48 0-.353-.013-.704-.04-1.053 36.976 3.03 66.04 34 66.04 71.757V110H32v-8.948c0-38.1 29.592-69.287 67.045-71.833-.03.374-.045.75-.045 1.129 0 11.863 14.998 21.48 33.5 21.48z" fill="'.concat(l,'"/>\n<path d="M132.5 58.761c21.89 0 39.635-12.05 39.635-26.913 0-.603-.029-1.2-.086-1.793a72.056 72.056 0 00-6.089-.76c.027.349.04.7.04 1.053 0 11.863-14.998 21.48-33.5 21.48-18.502 0-33.5-9.617-33.5-21.48 0-.379.015-.755.045-1.128-2.05.139-4.077.364-6.077.672a18.592 18.592 0 00-.103 1.956c0 14.864 17.745 26.913 39.635 26.913z" fill="#000" fill-opacity=".08"/>\n')},shirtScoopNeck:function(l){return '\n<path d="M132.5 65.828c27.338 0 49.5-13.199 49.5-29.48 0-1.363-.155-2.704-.456-4.017C210.784 41.487 232 68.791 232 101.052V110H32v-8.948c0-32.655 21.739-60.232 51.534-69.05A18.001 18.001 0 0083 36.348c0 16.281 22.162 29.48 49.5 29.48z" fill="'.concat(l,'"/>\n')},shirtVNeck:function(l){return '\n<path d="M92.68 29.936C58.295 35.366 32 65.138 32 101.052V110h200v-8.948c0-35.914-26.294-65.686-60.681-71.116a23.874 23.874 0 01-7.555 13.603l-29.085 26.229a4 4 0 01-5.358 0l-29.085-26.229a23.871 23.871 0 01-7.555-13.603z" fill="'.concat(l,'"/>\n')}},t={skullOutline:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M72.335 18.04c-.18 1.038-.442 2.069-.988 2.989-.72 1.211-2.026 1.706-2.783 2.818-1.193 1.752.392 4.276-.786 5.837-1.266 1.68-4.142.663-5.262 2.891-1.18 2.351.538 5.493-.943 7.83-1.47-.368-1.922-5.885-4.189-2.366-1.452 2.254-.471 3.475-2.648.235-.757-1.125-1.611-2.136-3.097-1.393-1.044.521-1.258 2.837-2.21 3.086-2.333.612-2.418-5.617-3.212-6.796-.436-.648-.842-1.032-1.617-1.277-.672-.213-1.869.215-2.425-.1-1.045-.592-1.186-2.556-1.225-3.598-.074-1.939.575-3.919.04-5.838-.451-1.612-1.887-2.603-2.357-4.183C36.1 9.64 47.683 4.895 54.3 4.63c7.74-.31 19.037 4.222 18.036 13.41zm1.838-5.316c-1.456-3.441-4.655-6.177-7.915-8.013a18.45 18.45 0 00-5.085-1.94c-1.641-.36-3.558-.123-5.125-.576-1.32-.383-2.138-1.243-3.692-1.193-2.118.068-4.319 1.172-6.168 2.086-3.66 1.807-6.771 4.148-8.726 7.743-2.098 3.859-1.9 7.356.349 10.952 2.145 3.434-.974 8.262 2.167 11.526 1.321 1.372 2.621.371 3.872 1.032.962.508.921 3.462 1.188 4.328 1.2 3.893 5.515 5.4 7.506 1.191.94 2.353 4.655 4.764 6.385 1.686 1.082 1.4 2.954 1.995 4.383.796 1.344-1.129 1.492-3.756 1.56-5.344.054-1.238-.497-2.764.454-3.658 1.047-.984 3.194-.57 4.37-1.839 1.34-1.45.789-3.146.892-4.872.104-1.746.416-1.301 1.71-2.562 2.885-2.81 3.374-7.807 1.875-11.343z" fill="#fff"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M50.42 29.122c2.02-1.823 1.591-7.398 1.424-9.96-.316-4.86-3.355-3.408-5.206-.38-1.4 2.29-4.766 5.994-3.257 8.876 1.202 2.296 5.18 3.136 7.039 1.463zm13.37-8.849c-1.034-1.92-1.42-2.211-2.65-3.784-.791-1.011-1.9-2.802-3.404-2.442-2.582.62-1.528 6.612-1.498 8.402.024 1.358-.277 2.765.851 3.728 1.155.986 3.053.897 4.44.69 4.259-.633 4.062-3.253 2.262-6.594zM55.24 32.83c-.284-.035.077-.362.12-.587.187.614.325.643-.12.587zm1.045-4.31c-2.617-2.77-7.574 6.397-4.08 7.425.805.237 1.4-.364 2.155-.468 1.1-.153 2.024.487 2.973-.522 1.492-1.584.187-5.098-1.048-6.436z" fill="#fff"/>\n'},skull:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M65.282 19.929c-.298 2.777-5.693 4.274-7.672 2.448-.911-.842-.927-2.574-1.129-3.702-.38-2.133-.655-4.258-.75-6.423-.058-1.325-.406-2.385 1.044-2.582.883-.12 1.793.468 2.515.933 2.447 1.573 6.33 6.138 5.992 9.326zm-12.4-5.853c.284 2.825 1.32 7.739-.936 10.105-2.016 2.115-6.16.018-6.783-2.473-.773-3.09 2.275-6.78 4.145-8.87.574-.641 1.844-2.412 2.836-1.82.382.228.693 2.612.737 3.058zm1.44 11.03c.646-1.523 6.912 3.019 3.953 5.18-.483.352-4.16 1.465-4.865.941-1.485-1.104.43-4.964.911-6.12zm19.003-7.58c-.443-15.475-20.26-19.84-30.85-11.022-4.048 3.372-6.362 7.5-6.468 12.779-.09 4.471.619 8.689 4.034 11.764 1.481 1.333 2.46 2.149 3.245 3.97.824 1.906 1.2 4.335 2.742 5.832.85.826 2.09 1.493 3.266.96 2.162-.979 1.47-3.977 2.125-5.648 2.037 4.968 7.211 6.553 8.15.249 1.031 1.819 3.726 4.2 5.7 2.21.812-.82.934-2.15 1.072-3.227.245-1.912-.18-2.664 1.355-3.975 4.039-3.45 5.773-8.672 5.63-13.891z" fill="#fff"/>\n'},resist:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M105.565 30.071c-3.082-.666-5.192 3.535-1.912 4.784 2.815 1.072 4.845-4.145 1.912-4.784zM104.191 27c3.657 0 2.308-5.981 2.321-7.965.014-2.137 1.545-8.596-.889-9.734-4.217-1.971-3.061 6.325-3.035 7.968.028 1.816.167 3.72-.229 5.508-.349 1.58-1.129 4.223 1.832 4.223zm-5.133-16.026c-1.082-.622-2.801-.32-3.987-.374-1.349-.06-2.69-.195-4.035-.293-2.177-.16-4.956-.563-7.118-.068-1.226.28-2.338 1.225-1.761 2.608.62 1.49 2.303 1.105 3.58 1.03.585-.035 2.033-.29 2.605-.089.997.35.573-.108.801 1.067.349 1.807.14 4 .125 5.838-.026 3.174-.036 6.364-.103 9.536-.026 1.236-.44 2.632.757 3.448.998.68 2.216.225 2.733-.793.514-1.013.026-3.067-.029-4.196-.066-1.347-.136-2.676-.097-4.025.104-3.585.282-7.167.368-10.754.943.046 1.922.018 2.856.15.683.095 1.665.535 2.323.5 1.898-.1 2.693-2.587.982-3.585zm-28.336 6.839c-.082-.644-.012-.053 0 0zm-.037-.276c0 .008.004.025 0 0zm1.432-3.11c3.416-3.981 4.583 4.347 7.245 3.995 4.261-.564-.94-6.953-2.668-7.776-3.515-1.675-6.605.08-8.277 3.267-2.098 4-.77 6.708 3.258 8.444 1.471.635 7.04 2.528 5.53 4.959-.76 1.224-3.526 1.329-4.7 1.086-2.356-.486-1.989-2.086-3.135-3.573-1.033-1.34-3.03-.947-3.342.781-.245 1.358 1.17 3.425 2.115 4.38 2.233 2.256 6.04 2.437 8.887 1.41 4.386-1.583 4.917-5.71 1.806-8.905-1.749-1.796-3.933-2.34-6.114-3.418-2.644-1.306-2.15-2.39-.605-4.65zM61.75 29.568c-.564-4.825-.696-9.718-.78-14.563-.027-1.554.706-5.206-1.453-5.865-2.915-.89-2.528 2.692-2.467 4.164.205 4.913.842 9.789 1.071 14.696.073 1.557-.429 4.574 1.831 4.946 2.75.454 2.008-2.081 1.798-3.378zM52.472 13.68c-2.36-3.159-7.154-3.669-10.09-.758-2.072 2.054-3.377 6.92-1.416 9.403 2.124 2.691 7.355.332 8.725 3.383 1.682 3.743-2.73 5.148-5.074 2.663-.843-.894-.659-2.454-1.9-3.007-1.763-.785-2.864.928-2.517 2.359.848 3.5 4.652 5.39 8.101 5.272 3.768-.13 5.402-2.977 5.163-6.4-.33-4.735-3.985-5.476-7.99-5.998-1.698-.22-1.92-.2-1.816-1.952.128-2.119 1.37-4.567 3.991-4.063 2.106.405 2.294 3.571 4.455 3.718 3.496.238 1.256-3.433.368-4.62zM34.721 29.438c-1.337.32-2.963.098-4.326.073-1.054-.018-4.575.427-5.262-.296-.76-.8-.513-3.247-.545-4.286-.046-1.454-.404-1.67.872-2 .749-.193 1.907-.096 2.682-.131 1.515-.07 3.465.21 4.93-.088 1.37-.28 2.502-1.751 1.25-3.004-.887-.888-2.542-.411-3.631-.386-2.034.046-4.069.036-6.103.072.008-1.568-.043-3.146.079-4.71 2.847.14 5.812.881 8.658.745 1.442-.07 3.04-.992 2.312-2.73-.625-1.49-2.522-1.287-3.844-1.346-1.653-.075-3.308-.113-4.962-.17-1.224-.042-3.005-.445-4.159.108-2.362 1.13-1.55 5.01-1.485 7.11.084 2.667.085 5.269.177 7.957.084 2.433-.037 5.641 2.852 6.325 2.89.684 6.245.033 9.192.176 1.209.058 2.861.41 3.455-.996.569-1.349-.73-2.774-2.142-2.423zM11.41 14.88c2.321.5 2.942 3.014 3.02 5.149.054 1.46.183 1.373-1.003 1.74-1.19.368-2.92.169-4.139.116-2.543-.11-2.235-.278-2.284-2.945-.012-.625-.475-3.504-.108-3.91.476-.528 3.839-.203 4.514-.15zm5.077 14.838c-1.29-1.504-2.586-2.94-4.034-4.286 2.158-.06 4.503-.473 5.27-2.819.648-1.982.085-5-.668-6.872-.994-2.47-3.062-4.119-5.635-4.479-1.796-.25-6.278-.672-7.62.711-1.465 1.509-.448 5.65-.358 7.497.16 3.271.044 6.518-.157 9.785-.065 1.055-.582 2.787-.041 3.737.6 1.054 2.059 1.317 2.969.537.984-.845.529-1.878.468-2.961-.093-1.676.075-3.404.174-5.074 1.608 1.312 3.25 2.591 4.762 4.022 1.493 1.414 2.564 3.202 3.99 4.627 1.011 1.01 2.82 1.425 3.331-.448.44-1.608-1.571-2.951-2.451-3.977z" fill="#fff"/>\n'},pizza:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M65.933 25.391c-4.082 1.38-8.55 3.324-10.905 7.074-1.847 2.942-1.971-.455-4.55.593-2.508 1.019-1.822 5.223-2.733 7.301-.708-1.191-1.043-2.516-1.935-3.604a6.607 6.607 0 001.814-1.724c.156-.32-4.792.348-5.076.43-1.411.401-2.74.77-4.088 1.429a78.83 78.83 0 001.965-2.989c.207-.68.576-.682 1.108-.006.748.036 1.178.357 1.962.177 2.915-.666 3.843-6.223.25-5.987a93.375 93.375 0 004.253-8.802c.502 4.291 6.08 2.813 7.719.525 2.14-2.989-.604-8.662-4.483-8.112.58-1.375 1.17-2.762 1.649-4.178 1.092 1.61 3.001 2.39 4.538 3.457a18.2 18.2 0 014.163 4.006c2.386 3.14 3.793 7.007 6.215 10.053a6.982 6.982 0 00-1.866.357zm9.006-4.388c-.632-5.758-5.15-11.601-9.44-15.176-2.55-2.125-10.24-7.385-13.306-3.34 2.472 1.071 5.2 1.33 7.65 2.489 3.32 1.572 5.922 4.16 8.168 7.055 3.138 4.045 7.97 12.283.474 14.386.518-.338.819-.709 1.228-1.308-1.007-.233-.6-1.878-.954-2.952-.412-1.25-1.21-2.467-1.884-3.582a56.617 56.617 0 00-3.504-5.171c-1.678-2.186-3.686-3.907-5.977-5.396-.907-.589-1.775-1.11-2.817-1.415-1.349-.394-.907.086-1.276-1.146-.232-.773-.024-1.763-.246-2.592-1.973 1.658-2.615 4.055-3.5 6.381-1.02 2.684-2.122 5.335-3.196 7.997-2.635 6.535-6.034 12.395-9.891 18.247-.672 1.02-2.165 2.95-1.09 4.174.96 1.095 2.33.306 3.386-.139 1.436-.604 3.385-2.164 4.935-1.347 1.998 1.054 1.054 4.984 4.214 4.827 3.114-.154 2.528-5.28 3.527-7.317 2.311 1.685 4.175.64 5.579-1.611 1.626-2.61 3.775-3.657 6.513-4.938 1.12-.524 3.034-1.94 4.2-2.115.966-.145 1.894.883 3.184.837 3.098-.113 4.392-4.253 4.023-6.848z" fill="#fff"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M53.537 23.834c-2.425-.445-5.807-.074-6.029 3.153-.136 1.978 1.41 3.848 3.082 4.664 5.122 2.5 9.109-6.688 2.947-7.817zm9.799-3.676c-.65-.706-1.703-1.24-2.675-.992.31-.215.568-.602.864-.84-3.156-2.286-5.14 3.479-3.346 5.748 2.718 3.44 8.037-.766 5.157-3.916z" fill="#fff"/>\n'},hola:function(){return '\n<path d="M63.837 17c-.286.65-.552 1.302-.818 1.953L63 19c.668-.048 1.334-.101 2-.158A18.705 18.705 0 0063.837 17zm-10.622.298c.2-.06.422-.127.708-.298.145.423.256 3.288-1.355 2.976-.92-.177-.506-1.764-.246-2.091.334-.42.585-.495.893-.587z" fill="#fff"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M74.637 16.948c-1.177-5.27-4.032-8.977-8.452-11.937-3.357-2.248-6.511-2.233-10.467-1.75-3.246.396-6.35 1.297-9.205 2.935-5.036 2.89-7.914 6.745-8.602 12.549-.276 2.322-.319 5.104.51 7.32.483 1.293 1.336 2.332 2.245 3.35.153.172.495.472.862.794.598.523 1.261 1.105 1.286 1.287.117.865-2.198 3.397-2.89 4.154l-.129.141c-.22.244-.727.594-1.298.988-1.019.703-2.244 1.548-2.426 2.196-.826 2.933 5.827 1.892 7.445 1.638l.01-.002c1.548-.242 3.107-.538 4.613-.976a19.86 19.86 0 002.068-.727c.561-.233 1.176-.696 1.785-1.155.692-.52 1.377-1.036 1.971-1.207.567-.163 1.337-.072 2.105.02.596.07 1.19.14 1.686.091a24.961 24.961 0 004.498-.87c2.62-.76 4.975-2.067 7.055-3.835 4.426-3.76 6.61-9.242 5.33-15.004zm-5.131 6.988c-.616.169-1.356-1.24-1.079-1.72.77-1.333 2.165 1.42 1.079 1.72zm-2.218-9.374c-.267 1.1.123 2.947.397 4.052.088.36.433.47.748.427.548-.076.444-.565.357-.976a1.712 1.712 0 01-.056-.397c.04-.748.107-2.639-.172-3.32-.513-1.254-.975-1.014-1.274.213zm-.65 8.33c-.582.343-.855-.288-1.051-.741a2.183 2.183 0 00-.156-.32c-.255-.382-.274-.588-.287-.72-.016-.179-.02-.222-.587-.388-1.77-.52-1.803.7-1.838 1.937-.02.722-.04 1.45-.405 1.842-1.778 1.91-.577-3.679-.361-4.682l.022-.106c.037-.174.079-.416.128-.699v-.001c.338-1.952 1.014-5.855 2.666-3.109.488.812 2.71 6.49 1.868 6.988zm-10.367-.954c.595.604 3.693.22 4.024-.34.685-1.177-1.85-.849-2.774-.73a5.404 5.404 0 01-.288.034c.04-.753.124-1.51.208-2.269.118-1.053.235-2.107.232-3.153l.003-.175c.016-.616.05-1.936-.961-1.206-.348.25-.338 1.19-.331 1.818.002.193.004.356-.005.462-.02.233-.077.593-.146 1.021-.24 1.512-.616 3.874.038 4.538zm-.775-2.78c-1.425 5.732-6.978 2.638-4.491-1.713.459-.803.83-.98 1.407-1.256.217-.104.462-.221.752-.39.05-.03.053-.14.057-.276.009-.275.02-.65.43-.644 1.76.027 2.183 2.936 1.845 4.28zm-7 .833c-.035.873-.133 3.305.973 2.999.761-.21.546-9.978-.331-9.984-.916-.005-.744 1.777-.594 3.325.097 1.004.184 1.91-.04 2.166-.112.127-.515.094-.844.067a2.134 2.134 0 00-.407-.012c-1.14.212-1.89.093-2.24-.606-.094-.187-.099-.706-.103-1.282-.011-1.331-.025-2.967-1.155-1.508.015.738.027 1.476.035 2.213.336.715.21 1.15-.376 1.306-.02.307.154.582.278.778.065.104.117.186.119.24.005.14-.009.373-.025.657-.073 1.262-.205 3.543.925 3.406.712-.086.486-2.288.368-3.43a8.686 8.686 0 01-.051-.6c.301.007.606.021.913.035.856.04 1.726.08 2.562-.027.001.05-.003.14-.007.257z" fill="#fff"/>\n'},diamond:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M63.78 29.736c-2.389 2.657-4.857 5.244-7.335 7.82.985-3.552 1.74-7.577 3.204-10.956.416-.963.1-1.085.927-1.494.609-.302 2.078.043 2.807.062 1.557.039 3.15.192 4.696-.05a221.823 221.823 0 00-4.298 4.619zm-15.264 4.062c-2.699-3.282-5.384-6.568-8.658-9.317 1.289.137 2.696-.043 3.958.206 1.944.384 1.837.99 2.82 2.959 1.45 2.906 2.889 5.789 4.05 8.823-.711-.9-1.441-1.785-2.17-2.67zm-9.098-12.531c.963-1.575 1.144-2.972 2.92-3.78 2.06-.939 5.3-.742 7.488-.916-1.37 1.523-3.037 3.103-3.604 5.122-.874-1.718-1.962-3.174-3.67-4.17-.215-.107 1.158 4.55 1.338 4.87-1.716-.096-3.522-.408-5.225-.092l.753-1.034zm16.406-5.008c1.592.036 3.17.16 4.74.42-1.267 1.675-1.649 3.631-2.099 5.63-.478-2.258-2.209-4.362-3.734-6.048l1.093-.002zm-3.498 1.074c.234-.158 4.457 5.086 5.066 5.556-3.312-.008-6.618-.17-9.926-.315 1.907-1.487 3.023-3.688 4.86-5.24zm2.687 17.096c-.402 1.349-.778 2.708-1.215 4.047-1.555-4.732-3.862-9.188-6.008-13.674 3.34.088 6.676.209 10.016.256-.82 3.158-1.862 6.245-2.793 9.37zm7.229-17.463c1.277 1.128 3.097 3.44 3.686 4.217.059.077.118.154.179.23.21.261.966 1.255 1.263 1.644-2.227-.226-4.545-.13-6.78-.15.498-2.054 1.104-4.012.584-6.128.357.057.712.12 1.068.187zm7.648 5.617c-2.158-2.676-4.37-7.258-7.864-8.077-3.472-.814-7.548-.454-11.074-.23-3.075.194-8.083-.204-10.795 1.593-1.393.923-2.425 3.005-2.908 4.551-.434 1.393.266 2.285-1.246 2.285-.096 0 2.504 3.673 2.81 3.962 2.272 2.14 4.444 4.202 6.457 6.597 2.835 3.374 5.405 8.338 9.145 9.736-.686-.339 2.792-2.967 3.21-3.419 2.11-2.288 4.246-4.554 6.372-6.83 1.938-2.073 4.05-4.03 5.93-6.15 1.435-1.618 1.439-2.175-.037-4.018zM35.999 14c.043.014-.909-2.045-.825-1.919-.475-.718-1.046-1.24-1.738-1.727C32.708 9.843 29.127 9.254 29 9c1.494 2.652 4.167 4.128 6.999 5zm15.356-4.804A6.21 6.21 0 0052.15 11c.07.078.859-4.184.85-4.547C52.988 5.832 52.613 2 51.815 2c-1.337 0-.674 6.47-.459 7.196zM77.97 7c-2.992 0-9.68 5.854-8.908 9 .005.01.447-.35.35-.283a.849.849 0 00.057-.043c1.272-1.025 2.718-2.02 3.992-3.206.911-.85 1.987-1.612 2.816-2.54C76.362 9.832 78.263 7 77.97 7z" fill="#fff"/>\n'},deer:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M71.764 15.26c1.59-.184 4.784-.552 5.196.975.302 1.091-1.165 2.077-2.263 2.815-.336.226-.637.428-.843.604l-.164.139c-1.456 1.241-2.965 2.528-4.661 3.408a12.85 12.85 0 01-2.926 1.083c-.279.07-.434.107-.55.196-.148.112-.235.305-.43.739l-.037.082c-.45 1.001-.721 2.18-.993 3.363-.234 1.016-.468 2.035-.818 2.95-1.704 4.453-5.767 14.8-12.267 10.258-1.707-1.193-2.774-3.31-3.75-5.244-.206-.41-.408-.81-.61-1.192-1.335-2.512-2.613-5.508-3.381-8.25a10.342 10.342 0 01-.206-.912c-.13-.683-.2-1.048-.923-1.503-.37-.233-.893-.363-1.403-.49-.35-.088-.695-.174-.981-.29-1.5-.61-2.813-1.436-4.088-2.43-1.238-.966-6.11-4.951-2.132-5.691 1.804-.336 4.16-.217 6.001-.124l.066.004c2.027.102 4.073.57 5.877 1.535l.012.007c.89.477 1.22.654 1.545.646.19-.005.379-.074.679-.182.236-.086.542-.197.973-.322-3.322-1.125-6.649-2.997-8.884-5.78-1.207-1.503-4-7.654-1.9-9.065 1.791-1.206 2.415 2.005 2.881 4.4.19.975.353 1.814.558 2.167 1.24 2.136 3.281 3.236 5.32 4.336.58.313 1.161.626 1.723.963-1.741-1.668-3.04-3.505-3.674-5.868l-.08-.294c-.315-1.143-.903-3.28-.439-4.192.529-1.04 1.772-1.106 2.458-.22.41.529.48 1.514.542 2.399.031.448.06.87.132 1.192.35 1.589.921 2.81 1.982 4.04 1.505 1.746 3.417 3.175 5.669 3.727 5.127 1.259 6.92-4.107 7.608-8.244.04-.243.056-.523.074-.817.054-.932.117-1.992.976-2.362 1.367-.589 1.896.746 1.936 1.781.087 2.314-1.056 5.857-2.166 7.845 2.79-1.732 5.003-4.478 5.899-7.688.105-.378.15-.905.197-1.468.103-1.205.22-2.58.977-3.035 1.54-.924 2.029.917 1.975 2.022-.319 6.515-5.298 12.44-11.488 14.069.21.105.388.2.542.28.954.505.989.524 2.306-.257a13.03 13.03 0 012.827-1.23c1.47-.452 3.055-.682 4.58-.817.146-.012.331-.034.546-.059zM58.86 24.62c-.067 3.271-3.238 3.04-2.822.095.326-2.311 3.681-2.233 2.822-.095zm-1.93 9.016c-.49 1.56-4.332 2.121-3.895-.17.369-1.942 4.554-2.026 3.895.17zM51.703 27c-2.82 0-1.895-4.875.996-3.861 2.275.796 1.327 3.861-.996 3.861z" fill="#fff"/>\n'},cumbia:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M10.272 30.131c3.273-.558 5.73-3.553 5.18-6.787-.464-2.724-1.745-.343-2.976.853-1.335 1.298-2.45 2.574-4.536 2.054-3.607-.9-4.858-5.4-3.84-8.48a5.941 5.941 0 013.478-3.696c1.852-.746 3.204.09 4.748 1.094.289.188 1.73 1.37 1.994 1.25.462-.211.115-2.43.045-2.725-.338-1.421-1.266-2.575-2.617-3.238-3.333-1.635-7.514.489-9.64 3.055-4.884 5.897-.92 18.164 8.164 16.62zm10.011-19.093c0 .001-.001.003 0 0zm-1.594 12.865c.503 3.474 2.977 6.5 6.952 6.357 4.278-.155 6.056-4.098 7.009-7.486.956-3.399 2.05-7.683.663-11.093-.42-1.032-.685-2.38-1.716-1.53-1.253 1.033-1.409 4.039-1.515 5.442-.2 2.647-.781 9.97-4.108 10.944-4.179 1.222-4.047-5.848-4-7.977.04-1.896.246-3.734-.342-5.584-.313-.985-.59-2.44-1.528-1.634-1.29 1.108-1.453 3.828-1.544 5.327-.144 2.405-.213 4.842.129 7.234zm19.094 2.843c.188.412.624 1.402 1.02 1.679.944.66-.055.708.8-.059.813-.729 1.13-2.717 1.254-3.67.385-2.96-.12-6.109-.087-9.093 1.024 2.218 1.584 4.584 2.386 6.874.554 1.582 1.396 4.804 3.654 4.753 2.443-.055 2.57-3.145 2.894-4.819.461-2.37.97-4.721 1.676-7.037.092 3.91-1.427 10.995 2.108 13.92.014.013 1.432-4.15 1.467-4.406.223-1.691.083-3.444.107-5.148.051-3.597.718-8.003-.3-11.506-.328-1.134-.975-2.264-2.409-2.233-1.825.04-2.233 1.985-2.698 3.298-1.28 3.614-2.445 7.224-3.357 10.94-.548-1.68-5.339-16.421-8.789-10.901-.555.888-.315 2.218-.338 3.196-.044 1.879-.155 3.756-.196 5.635-.061 2.843-.41 5.907.808 8.577zM62.02 13.71c.72-.136 5.735-1.727 5.523-.136-.223 1.675-4.633 3.309-5.816 3.876a10.629 10.629 0 00-.643-3.567l.936-.173zm5.717-.64c-.027-.035 0 0 0 0zm.122 8.341c2.273 1.22 1.287 3.417-.426 4.608-.649.45-6.53 1.802-6.513 1.663 0 .004 0 .005-.004.005.18-1.695-.257-5.018 1-6.02 1.304-1.04 4.5-.808 5.943-.256zm.062-7.996c.001.003.009.023 0 0zM57.944 30.26c.224.551.86 1.912 1.566 1.945.86.04.794-1.043.929-1.71 3.441 1.721 8.498-.047 10.907-3.03 2.787-3.45 1.348-8.27-2.579-9.745 2.113-1.688 4.026-5.399 1.255-7.49-2.196-1.655-5.828-1.747-8.123-.302-2.735 1.723-3.85 5.833-4.09 9.006-.255 3.382-1.158 8.125.135 11.326zm18.106-8.389c.074 2.07-.15 4.287.332 6.306.171.717.433 1.511.76 2.162.611 1.215.31 1.05 1.032.36 2.172-2.083 1.209-8.575 1.157-11.249-.041-2.078.064-4.28-.513-6.283-.162-.562-1.123-3.348-1.655-3.284-.816.098-1.376 3.93-1.423 4.693-.148 2.396.226 4.895.31 7.295zm18.698.559c-1.583-.137-3.622.075-5.117.557.697-1.916 1.475-4.054 2.239-5.79a81.68 81.68 0 011.493-3.24c1.278 2.686 1.992 5.828 2.832 8.666-.48-.087-.962-.151-1.447-.193zm5.44.725c-.727-2.78-1.579-5.532-2.426-8.28-.537-1.743-1.13-3.911-2.6-5.168-4.163-3.561-6.527 5.85-7.548 8.232-.985 2.296-2.216 4.634-2.85 7.049a9.479 9.479 0 00-.244 3.652c.205 1.519-.004 1.741 1.294.915 1-.637 1.414-1.793 2.227-2.563.144-.136.218-.668.39-.755.189-.096 1.504.253 1.815.274 2.17.151 4.712-.218 6.715-1.054.205.842 1.627 5.962 2.977 5.773.597-.083.965-3.064.992-3.537.087-1.553-.352-3.049-.742-4.538zm9.114-13.723c-.264-1.203-.814-3.292-1.842-2.112-1.391 1.596-1.091 5.173-1.111 7.177-.015 1.451-1.552 12.062.556 11.883-.09 0 .845-1.668.981-1.922.814-1.524 1.13-2.97 1.328-4.722.365-3.237.783-7.111.088-10.304zm-1.138 20.869c-2.239-2.728-6.311.658-5.041 3.374 1.729 3.7 7.331-.56 5.041-3.374zm-13.266 4.244c-2.891-.738-6.297-.24-9.249-.152-3.081.092-6.16.264-9.24.357-6.568.198-13.124.092-19.692.038-12.454-.103-24.935.69-37.383.168-2.672-.112-5.545-.713-8.198-.209-.727.139-3.009.543-3.329 1.266-.336.76 1.402 1.555 2.331 1.955 2.422 1.044 5.329.858 7.9.964 2.93.12 5.887.058 8.819-.014 12.075-.297 24.089-1.343 36.18-1.165 6.976.103 13.937.038 20.913.002 3.319-.018 6.999.525 10.272-.063.552-.1 3.763-.854 3.807-1.836.02-.453-2.806-1.228-3.13-1.311z" fill="#fff"/>\n'},bear:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M76.739 17.439c1.188 2.084 1.852 4.35 2.088 6.73.04.383.061.762.065 1.136v.211c-.093 10.22-13.611 16.856-22.478 17.351-.632.036-1.264.053-1.892.053h-.014c-10.082-.002-19.562-4.553-22.533-14.847a13.794 13.794 0 01-.522-3.818c0-3.357 1.118-6.82 3.15-9.401.237-.3.533-.589.83-.878.366-.358.735-.718.995-1.104.476-.705.645-.687.669-.737.022-.048-.083-.156-.182-.988-.058-.49-.218-.929-.38-1.37-.212-.582-.426-1.168-.41-1.881.053-2.39 1.768-5.078 4.053-5.942 1.29-.486 2.675-.344 3.967.078.586.191 1.177.668 1.748 1.13.573.46 1.125.906 1.633 1.034.973.244 2.832-.134 4.478-.468.954-.194 1.837-.374 2.435-.41 1.394-.082 2.797-.122 4.192-.033.279.018.725.12 1.213.23.834.19 1.787.407 2.228.279.448-.13.913-.512 1.395-.908.485-.397.986-.809 1.505-.993a8.099 8.099 0 012.72-.463c.162 0 .325.005.487.014 2.329.133 4.995 1.185 5.984 3.427.798 1.809.247 3.294-.338 4.872-.194.524-.392 1.057-.546 1.617-.195.709-.31.847-.29.96.022.114.181.202.537.825.075.13.346.437.61.737.153.173.303.343.413.476.797.97 1.567 1.988 2.19 3.08zM58.299 36.97c3.069 2.96 6.669-1.57 7.148-4.385.843-10.061-15.069-8.744-19.224-3.003-2.102 2.904-.617 6.816 2.575 8.217 1.395.612 2.582.905 3.585-.05.797-.761 1.024-3.52.488-4.269-.28-.39-.661-.5-1.044-.61-.544-.155-1.09-.312-1.344-1.281-.57-2.17 1.807-2.507 3.296-2.625.279-.022.607-.06.967-.102 1.691-.199 4.059-.477 5.035.513 1.3 1.32.257 2.343-.832 3.41-1.209 1.186-2.473 2.425-.65 4.184zm-9.582-20.46c-.584-.99-1.748-1.23-2.732-.787-1.812.824-.95 3.513.757 3.743 1.617.217 2.777-1.6 1.975-2.956zm15.23.868c-.856 3.006-5.636-.378-2.936-2.29 1.552-1.099 3.447.491 2.936 2.29z" fill="#fff"/>\n'},bat:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M87.685 13.403c-1.394-6.431-6.21-10.15-12.5-11.586-2.526-.577-10.913-2.387-9.606 2.408.592 2.172.263 3.964-1.554 5.766-1.77 1.755-5.231 2.2-6.952-.011-1.474-1.895.427-4.721-.721-6.567-.446-.717-1.216-1.083-2.028-.732-1.141.494-.534 1.555-1.073 2.318-.849 1.203-1.245.826-2.01-.373-.48-.754-.008-1.575-1.246-1.897-1.433-.372-1.902.828-2.032 1.923-.082.687.322 1.792.336 2.488.027 1.364-.09 3.323-.725 4.529-1.125 2.137-2.704 1.453-4.383.096-1.98-1.602-2.561-3.385-2.178-5.817.459-2.917.292-5.709-3.28-3.884-5.02 2.564-9.68 7.135-12.588 11.919-2.445 4.02-4.37 8.893-2.203 13.473 2.21 4.675 5.862 8.69 10.966 9.884 1.322.308 5.092 1.81 6.345.55 1.947-1.956-2.548-3.782-3.435-4.974-1.258-1.69-2.337-4.915-.956-6.822 1.759-2.427 3.598-1.074 5.044.644 1.136 1.348 2.75 4.826 4.506 2.022 1.21-1.931 1.101-5.102 4.4-3.717 4.715 1.978 4.86 11.112 5.7 15.291.367 1.83 2.035 4.064 3.47 1.525.79-1.395.364-4.421.22-5.863-.296-2.985-1.08-5.92-.11-8.877.562-1.71 2.001-4.16 4.13-2.844 1.725 1.066 1.006 5.816 3.352 5.807 2.067-.007 1.504-3.791 2.604-5.039 1.68-1.904 4.916-.999 5.91 1.249 1.336 3.025-2.203 5.126-2.044 7.785.154 2.591 3.494 1.58 4.89.923 2.872-1.35 5.119-3.853 6.676-6.571 2.407-4.204 4.125-10.222 3.075-15.026" fill="#fff"/>\n'}},i={angryNatural:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M44.095 17.125c.004-.009.004-.009 0 0zM19.284 5.005c-2.368-.266-4.858.497-6.427 2.434-.59.728-1.553 2.48-1.509 3.417.017.356.225.375 1.124.59 1.646.392 4.5-1.114 6.355-.972 2.582.198 5.046 1.395 7.283 2.679 3.838 2.202 8.354 6.84 13.093 6.598.353-.018 5.42-1.739 4.41-2.723-.316-.484-3.034-1.128-3.501-1.361-2.172-1.084-4.367-2.448-6.443-3.718-4.528-2.772-8.944-6.338-14.385-6.944zm48.746 12.12c-.004-.009-.004-.009 0 0zm24.876-12.12c2.367-.266 4.857.497 6.426 2.434.59.728 1.554 2.48 1.509 3.417-.017.356-.225.375-1.124.59-1.645.392-4.5-1.114-6.355-.972-2.582.198-5.046 1.395-7.282 2.679-3.839 2.202-8.355 6.84-13.093 6.598-.353-.018-5.42-1.739-4.411-2.723.317-.484 3.034-1.128 3.502-1.361 2.171-1.084 4.367-2.448 6.442-3.718 4.528-2.772 8.945-6.338 14.386-6.944z" fill="#000" fill-opacity=".6"/>\n'},defaultNatural:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M26.547 6.148c-5.807.269-15.195 4.488-14.953 10.344.008.192.29.276.427.129 2.755-2.96 22.316-5.95 29.205-4.365.63.145 1.11-.477.71-.927-3.422-3.848-10.186-5.426-15.389-5.18zm59.906 0c5.807.269 15.195 4.488 14.953 10.344-.008.192-.29.276-.427.129-2.755-2.96-22.316-5.95-29.205-4.365-.63.145-1.11-.477-.71-.927 3.422-3.848 10.186-5.426 15.389-5.18z" fill="#000" fill-opacity=".6"/>\n'},flatNatural:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M38.66 11.09c-4.998.362-9.923.086-14.918-.122-3.83-.158-7.717-.681-11.374 1.012-.7.324-4.53 2.28-4.44 3.349.07.855 3.935 2.191 4.63 2.436 3.67 1.29 7.181.895 10.954.67 4.628-.278 9.236-.074 13.861-.214 3.116-.093 7.917-.62 9.457-4.398.464-1.137.105-3.413-.36-4.657-.185-.496-.72-.683-1.125-.397-1.45 1.023-4.261 2.146-6.685 2.321zm34.68 0c4.998.362 9.923.086 14.918-.122 3.83-.158 7.717-.681 11.374 1.012.7.324 4.53 2.28 4.441 3.349-.071.855-3.936 2.191-4.632 2.436-3.668 1.29-7.18.895-10.954.67-4.627-.278-9.235-.074-13.86-.214-3.116-.093-7.917-.62-9.457-4.398-.464-1.137-.105-3.413.36-4.657.185-.496.72-.683 1.125-.397 1.45 1.023 4.261 2.146 6.685 2.321z" fill="#000" fill-opacity=".6"/>\n'},frownNatural:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M36.37 6.876c-1.97 2.905-5.546 4.64-8.738 5.684-3.943 1.29-18.552 3.38-15.112 11.348a.147.147 0 00.272.002c1.153-2.645 17.465-5.123 18.973-5.704 4.445-1.709 8.393-5.49 9.162-10.543.352-2.317-.637-6.049-1.548-7.55-.11-.18-.374-.136-.43.069-.36 1.331-1.41 4.971-2.58 6.694zm39.26 0c1.97 2.905 5.546 4.64 8.738 5.684 3.943 1.29 18.551 3.379 15.112 11.348a.147.147 0 01-.272.002c-1.153-2.645-17.465-5.123-18.973-5.704-4.445-1.709-8.393-5.49-9.162-10.543-.352-2.317.637-6.049 1.548-7.55.11-.18.374-.136.43.069.36 1.331 1.41 4.971 2.58 6.694z" fill="#000" fill-opacity=".6"/>\n'},raisedExcitedNatural:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M22.766 1.578l.911-.402C28.92-.905 36.865-.033 41.723 2.299c.567.272.18 1.153-.402 1.108-14.919-1.151-24.963 8.146-28.375 14.44-.101.187-.407.208-.482.034-2.308-5.319 4.45-13.985 10.302-16.303zm66.468 0l-.911-.402C83.08-.905 75.135-.033 70.277 2.299c-.567.272-.18 1.153.402 1.108 14.919-1.151 24.963 8.146 28.375 14.44.101.187.407.208.483.034 2.307-5.319-4.45-13.985-10.303-16.303z" fill="#000" fill-opacity=".6"/>\n'},sadConcernedNatural:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M31.234 20.422l-.911.402c-5.242 2.081-13.188 1.209-18.046-1.123-.567-.273-.18-1.153.402-1.108 14.919 1.151 24.963-8.146 28.375-14.44.101-.187.407-.208.482-.034 2.308 5.319-4.45 13.985-10.302 16.303zm49.532 0l.911.402c5.242 2.081 13.188 1.209 18.046-1.123.567-.273.18-1.153-.402-1.108-14.919 1.151-24.963-8.146-28.375-14.44-.101-.187-.407-.208-.483-.034-2.307 5.319 4.45 13.985 10.303 16.303z" fill="#000" fill-opacity=".6"/>\n'},unibrowNatural:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M56.997 12.82c0-.003 0-.003 0 0zM96.12 7.602c1.463.56 9.19 6.427 7.865 9.153a.809.809 0 01-1.291.224c-.545-.517-1.576-1.112-1.706-1.184-5.106-2.835-11.299-1.925-16.73-.91-6.12 1.145-12.11 3.487-18.387 2.68-2.04-.263-6.081-1.222-7.626-2.963-.471-.532-.066-1.381.634-1.434 1.443-.11 2.861-.857 4.33-1.274 3.653-1.039 7.398-1.563 11.114-2.29 6.62-1.298 15.17-4.53 21.797-2.002z" fill="#000"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M58.76 12.759c-1.171.04-2.797 3.557-.561 3.677 2.235.119 1.73-3.718.56-3.677zm-3.757.031c.001-.003.001-.003 0 0zM15.881 7.573c-1.464.56-9.19 6.427-7.866 9.154a.809.809 0 001.291.224c.546-.518 1.577-1.113 1.707-1.185 5.106-2.834 11.298-1.925 16.73-.909 6.12 1.144 12.109 3.486 18.387 2.679 2.04-.263 6.081-1.221 7.626-2.962.471-.532.066-1.382-.634-1.435-1.444-.11-2.862-.856-4.33-1.274-3.654-1.038-7.399-1.563-11.115-2.29-6.62-1.297-15.17-4.53-21.796-2.002z" fill="#000"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M54.973 11.79c1.17.04 2.762 4.5.525 4.673-2.237.173-1.696-4.715-.525-4.674z" fill="#000"/>\n'},upDownNatural:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M22.766 1.578l.911-.402C28.92-.905 36.865-.033 41.723 2.299c.567.272.18 1.153-.402 1.108-14.919-1.151-24.963 8.146-28.375 14.44-.101.187-.407.208-.482.034-2.308-5.319 4.45-13.985 10.302-16.303zM86.993 12.07c5.761.773 14.746 5.795 13.994 11.607-.024.19-.312.25-.436.091-2.487-3.188-21.712-7.872-28.713-6.894-.641.09-1.064-.571-.627-.984 3.744-3.536 10.62-4.518 15.782-3.82z" fill="#000" fill-opacity=".6"/>\n'},raisedExcited:function(){return '\n<path d="M15.976 17.128C17.47 7.605 30.059 1.108 39.164 5.3a2 2 0 101.672-3.633c-11.487-5.29-26.9 2.664-28.812 14.84a2 2 0 003.952.62zm80.048 0C94.53 7.605 81.942 1.108 72.837 5.3a2 2 0 11-1.673-3.633c11.487-5.29 26.9 2.664 28.812 14.84a2 2 0 01-3.952.62z" fill="#000" fill-opacity=".6"/>\n'},angry:function(){return '\n<path d="M15.611 15.184c4.24-5.768 6.878-5.483 13.313-.627l.67.507C34.422 18.726 36.708 20 40 20a2 2 0 100-4c-2.066 0-3.901-1.022-7.989-4.123l-.678-.514c-3.76-2.836-5.959-4.076-8.695-4.37-3.684-.399-7.058 1.48-10.25 5.822a2 2 0 103.223 2.37zm80.777 0c-4.24-5.768-6.877-5.483-13.312-.627l-.67.507C77.578 18.726 75.292 20 72 20a2 2 0 110-4c2.066 0 3.901-1.022 7.989-4.123l.678-.514c3.76-2.836 5.959-4.076 8.695-4.37 3.684-.399 7.058 1.48 10.25 5.822a2 2 0 11-3.224 2.37z" fill="#000" fill-opacity=".6"/>\n'},default:function(){return '\n<path d="M15.63 17.159c3.915-5.51 14.648-8.598 23.893-6.328a2 2 0 10.954-3.884C29.74 4.31 17.312 7.887 12.37 14.84a2 2 0 103.26 2.318zm80.74 0c-3.915-5.51-14.648-8.598-23.893-6.328a2 2 0 11-.954-3.884c10.737-2.637 23.165.94 28.108 7.894a2 2 0 01-3.26 2.318z" fill="#000" fill-opacity=".6"/>\n'},sadConcerned:function(){return '\n<path d="M38.028 5.591c-1.48 8.389-14.09 14.18-23.238 10.432-1.015-.416-2.19.031-2.627.999-.436.968.033 2.09 1.048 2.505 11.444 4.69 26.835-2.38 28.762-13.303.183-1.039-.551-2.023-1.64-2.197-1.09-.175-2.121.525-2.305 1.564zm35.945 0c1.48 8.389 14.09 14.18 23.238 10.432 1.014-.416 2.19.031 2.627.999.436.968-.033 2.09-1.048 2.505-11.444 4.69-26.835-2.38-28.762-13.303-.183-1.039.551-2.023 1.64-2.197 1.09-.175 2.121.525 2.305 1.564z" fill="#000" fill-opacity=".6"/>\n'},upDown:function(){return '\n<path d="M15.591 14.162c4.496-6.326 14.012-9.509 23.756-6.366a2 2 0 101.228-3.807c-11.408-3.68-22.74.11-28.244 7.856a2 2 0 103.26 2.317zm80.786 6.996c-3.914-5.509-14.647-8.598-23.892-6.328a2 2 0 01-.954-3.884c10.736-2.637 23.165.94 28.107 7.895a2 2 0 11-3.26 2.317z" fill="#000" fill-opacity=".6"/>\n'}},r={squint:function(){return '\n<path d="M44 20.727c0 4.268-6.268 7.727-14 7.727s-14-3.46-14-7.727S22.268 13 30 13s14 3.46 14 7.727zm52 0c0 4.268-6.268 7.727-14 7.727s-14-3.46-14-7.727S74.268 13 82 13s14 3.46 14 7.727z" fill="#fff"/>\n<path d="M32.82 28.297c-.91.103-1.854.157-2.82.157-.966 0-1.91-.054-2.82-.157a6 6 0 115.64 0zm52 0c-.91.103-1.854.157-2.82.157-.966 0-1.91-.054-2.82-.157a6 6 0 115.64 0z" fill="#000" fill-opacity=".7"/>\n'},closed:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M16.16 27.553C18.007 31.352 22.164 34 26.998 34c4.816 0 8.961-2.63 10.817-6.407.552-1.122-.233-2.04-1.024-1.36-2.451 2.107-5.932 3.423-9.793 3.423-3.74 0-7.124-1.235-9.56-3.228-.891-.728-1.818.014-1.278 1.125zm58 0C76.007 31.352 80.164 34 84.998 34c4.816 0 8.961-2.63 10.817-6.407.552-1.122-.233-2.04-1.024-1.36-2.451 2.107-5.932 3.423-9.793 3.423-3.74 0-7.124-1.235-9.56-3.228-.891-.728-1.818.014-1.278 1.125z" fill="#000" fill-opacity=".6"/>\n'},cry:function(){return '\n<path d="M25 27s-6 7.27-6 11.27a6 6 0 1012 0c0-4-6-11.27-6-11.27z" fill="#92D9FF"/>\n<path d="M36 22a6 6 0 11-12 0 6 6 0 0112 0zm52 0a6 6 0 11-12 0 6 6 0 0112 0z" fill="#000" fill-opacity=".6"/>\n'},default:function(){return '\n<path d="M36 22a6 6 0 11-12 0 6 6 0 0112 0zm52 0a6 6 0 11-12 0 6 6 0 0112 0z" fill="#000" fill-opacity=".6"/>\n'},eyeRoll:function(){return '\n<path d="M44 22c0 7.732-6.268 14-14 14s-14-6.268-14-14S22.268 8 30 8s14 6.268 14 14zm52 0c0 7.732-6.268 14-14 14s-14-6.268-14-14S74.268 8 82 8s14 6.268 14 14z" fill="#fff"/>\n<path d="M36 14a6 6 0 11-12 0 6 6 0 0112 0zm52 0a6 6 0 11-12 0 6 6 0 0112 0z" fill="#000" fill-opacity=".7"/>\n'},happy:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M16.16 22.447C18.007 18.648 22.164 16 26.998 16c4.816 0 8.961 2.63 10.817 6.407.552 1.122-.233 2.04-1.024 1.36-2.451-2.107-5.932-3.423-9.793-3.423-3.74 0-7.124 1.235-9.56 3.228-.891.728-1.818-.014-1.278-1.125zm58 0C76.007 18.648 80.164 16 84.998 16c4.816 0 8.961 2.63 10.817 6.407.552 1.122-.233 2.04-1.024 1.36-2.451-2.107-5.932-3.423-9.793-3.423-3.74 0-7.124 1.235-9.56 3.228-.891.728-1.818-.014-1.278-1.125z" fill="#000" fill-opacity=".6"/>\n'},hearts:function(){return '\n<path d="M35.958 10c-2.55 0-5.074 1.98-6.458 3.82-1.39-1.84-3.907-3.82-6.458-3.82C17.552 10 14 13.334 14 17.641c0 5.73 4.412 9.13 9.042 12.736 1.653 1.236 4.78 4.4 5.166 5.094.386.693 2.106.718 2.584 0 .477-.718 3.51-3.858 5.166-5.094C40.585 26.77 45 23.37 45 17.64c0-4.306-3.552-7.64-9.042-7.64zm53 0c-2.55 0-5.074 1.98-6.458 3.82-1.39-1.84-3.907-3.82-6.458-3.82C70.552 10 67 13.334 67 17.641c0 5.73 4.412 9.13 9.042 12.736 1.653 1.236 4.78 4.4 5.166 5.094.386.693 2.106.718 2.584 0 .477-.718 3.51-3.858 5.166-5.094C93.585 26.77 98 23.37 98 17.64c0-4.306-3.552-7.64-9.042-7.64z" fill="#FF5353" fill-opacity=".8"/>\n'},side:function(){return '\n<path d="M26.998 16c-4.834 0-8.991 2.648-10.838 6.447-.54 1.111.387 1.853 1.277 1.125 2.437-1.993 5.82-3.228 9.56-3.228.082 0 .163 0 .244.002a6 6 0 1010.699 2.8 2 2 0 00-.125-.739 7.55 7.55 0 00-.144-.372 6.007 6.007 0 00-1.646-2.484C33.9 17.317 30.507 16 26.998 16zm58 0c-4.834 0-8.991 2.648-10.838 6.447-.54 1.111.387 1.853 1.278 1.125 2.436-1.993 5.82-3.228 9.56-3.228.08 0 .162 0 .243.002a6 6 0 1010.699 2.8 2 2 0 00-.125-.739 7.55 7.55 0 00-.144-.372 6.007 6.007 0 00-1.646-2.484C91.9 17.317 88.506 16 84.998 16z" fill="#000" fill-opacity=".6"/>\n'},surprised:function(){return '\n<path d="M44 22c0 7.732-6.268 14-14 14s-14-6.268-14-14S22.268 8 30 8s14 6.268 14 14zm52 0c0 7.732-6.268 14-14 14s-14-6.268-14-14S74.268 8 82 8s14 6.268 14 14z" fill="#fff"/>\n<path d="M36 22a6 6 0 11-12 0 6 6 0 0112 0zm52 0a6 6 0 11-12 0 6 6 0 0112 0z" fill="#000" fill-opacity=".7"/>\n'},wink:function(){return '\n<path d="M36 22a6 6 0 11-12 0 6 6 0 0112 0z" fill="#000" fill-opacity=".6"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M70.61 24.955c1.576-3.918 5.54-6.85 10.36-7.188 4.805-.335 9.124 1.999 11.24 5.637.628 1.081-.091 2.052-.928 1.428-2.592-1.93-6.156-3-10.008-2.731-3.731.26-7.02 1.729-9.312 3.887-.838.789-1.814.113-1.353-1.033z" fill="#000" fill-opacity=".6"/>\n'},winkWacky:function(){return '\n<circle cx="82" cy="22" r="12" fill="#fff"/>\n<circle cx="82" cy="22" r="6" fill="#000" fill-opacity=".7"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M16.16 25.447C18.007 21.648 22.164 19 26.998 19c4.816 0 8.961 2.63 10.817 6.407.552 1.122-.233 2.04-1.024 1.36-2.451-2.107-5.932-3.423-9.793-3.423-3.74 0-7.124 1.235-9.56 3.228-.891.728-1.818-.014-1.278-1.125z" fill="#000" fill-opacity=".6"/>\n'},xDizzy:function(){return '\n<path d="M34.5 30.7L29 25.2l-5.5 5.5c-.4.4-1.1.4-1.6 0l-1.6-1.6c-.4-.4-.4-1.1 0-1.6l5.5-5.5-5.5-5.5c-.4-.5-.4-1.2 0-1.6l1.6-1.6c.4-.4 1.1-.4 1.6 0l5.5 5.5 5.5-5.5c.4-.4 1.1-.4 1.6 0l1.6 1.6c.4.4.4 1.1 0 1.6L32.2 22l5.5 5.5c.4.4.4 1.1 0 1.6l-1.6 1.6c-.4.4-1.1.4-1.6 0zm54 0L83 25.2l-5.5 5.5c-.4.4-1.1.4-1.6 0l-1.6-1.6c-.4-.4-.4-1.1 0-1.6l5.5-5.5-5.5-5.5c-.4-.5-.4-1.2 0-1.6l1.6-1.6c.4-.4 1.1-.4 1.6 0l5.5 5.5 5.5-5.5c.4-.4 1.1-.4 1.6 0l1.6 1.6c.4.4.4 1.1 0 1.6L86.2 22l5.5 5.5c.4.4.4 1.1 0 1.6l-1.6 1.6c-.4.4-1.1.4-1.6 0z" fill="#000" fill-opacity=".6"/>\n'}},d={beardLight:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M101.428 98.169c-2.513 2.294-5.19 3.325-8.575 2.604-.582-.124-2.957-4.538-8.853-4.538-5.897 0-8.27 4.414-8.853 4.538-3.385.721-6.062-.31-8.576-2.604-4.725-4.313-8.654-10.26-6.293-16.75 1.23-3.382 3.232-7.095 6.873-8.173 3.887-1.15 9.346-.002 13.264-.788 1.27-.254 2.656-.707 3.585-1.458.929.75 2.316 1.204 3.585 1.458 3.918.786 9.376-.362 13.264.788 3.641 1.078 5.642 4.79 6.873 8.173 2.361 6.49-1.568 12.437-6.294 16.75zM140.081 26c-3.41 8.4-2.093 18.858-2.724 27.676-.513 7.167-2.02 17.91-8.384 22.538-3.255 2.368-9.179 6.346-13.431 5.236-2.927-.764-3.24-9.16-7.087-12.303-4.363-3.565-9.812-5.131-15.306-4.89-2.37.105-7.165.08-9.15 1.903-1.983-1.822-6.777-1.798-9.148-1.902-5.494-.242-10.943 1.324-15.306 4.889-3.847 3.143-4.16 11.54-7.087 12.303-4.252 1.11-10.176-2.868-13.431-5.236-6.365-4.628-7.87-15.37-8.384-22.538-.63-8.818.686-19.276-2.724-27.676-1.66 0-.565 16.129-.565 16.129v20.356c.032 15.288 9.581 38.17 30.754 46.908C63.286 111.53 75.015 115 84 115s20.714-3.14 25.892-5.277c21.173-8.737 30.722-31.95 30.754-47.238V42.13S141.74 26 140.081 26z" fill="'.concat(l,'"/>\n')},beardMajestic:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M65.18 77.737c2.183-1.632 15.226-2.258 17.578-3.648.734-.434 1.303-.873 1.742-1.309.439.436 1.009.875 1.742 1.31 2.351 1.389 15.395 2.014 17.578 3.647 2.21 1.654 3.824 5.448 3.647 8.414-.212 3.56-4.106 12.052-13.795 13.03-2.114-2.353-5.435-3.87-9.172-3.87-3.737 0-7.058 1.517-9.172 3.87-9.69-.978-13.583-9.47-13.795-13.03-.176-2.966 1.437-6.76 3.647-8.414zm.665 17.164l.017.007-.017-.007zm79.018-38.916c-.389-5.955-1.585-11.833-2.629-17.699-.281-1.579-1.81-12.286-2.499-12.286-.233 9.11-1.033 18.08-2.065 27.14-.309 2.708-.632 5.416-.845 8.134-.171 2.196.135 4.848-.397 6.972-.679 2.707-4.08 5.232-6.725 6.165-6.6 2.326-12.105-7.303-17.742-10.12-7.318-3.656-19.897-4.527-27.38.239-7.645-4.766-20.224-3.895-27.542-.239-5.637 2.817-11.142 12.446-17.742 10.12-2.645-.933-6.047-3.459-6.725-6.165-.532-2.124-.226-4.776-.397-6.972-.213-2.718-.536-5.426-.845-8.135C30.298 44.08 29.498 35.11 29.265 26c-.689 0-2.218 10.707-2.5 12.286-1.043 5.866-2.24 11.744-2.627 17.7-.4 6.119.077 12.182 1.332 18.177a165.44 165.44 0 002.049 8.541c.834 3.143-.32 9.262.053 12.488.707 6.104 3.582 18.008 6.811 23.259 1.561 2.538 3.39 4.123 5.433 6.168 1.967 1.969 2.788 5.021 4.91 7.118 3.956 3.908 9.72 6.234 15.64 6.806C65.677 143.05 74.506 146 84.5 146c9.995 0 18.823-2.95 24.135-7.457 5.919-.572 11.683-2.898 15.639-6.806 2.122-2.097 2.943-5.149 4.91-7.118 2.042-2.045 3.872-3.63 5.433-6.168 3.229-5.251 6.104-17.155 6.811-23.259.373-3.226-.781-9.345.053-12.488.751-2.828 1.45-5.676 2.05-8.54 1.254-5.996 1.73-12.06 1.332-18.179z" fill="'.concat(l,'"/>\n')},beardMedium:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M84.504 93.841c-11.51.378-16.646 5.88-20.513.289-2.903-4.198-1.688-11.256 1.024-15.227 3.859-5.652 9.094-2.918 14.947-3.563 1.592-.175 3.19-.617 4.542-1.34 1.352.723 2.95 1.165 4.542 1.34 5.854.645 11.089-2.089 14.948 3.563 2.712 3.97 3.926 11.03 1.024 15.227-3.868 5.591-9.002-.667-20.514-.289zM140.391 26c-3.424 14.075-4.998 28.434-7.481 42.671a319.343 319.343 0 01-1.685 8.879c-.127.62-.251 2.923-.862 3.214-1.851.884-5.624-3.817-6.633-4.879-2.533-2.666-5.045-5.356-8.131-7.448-6.234-4.227-13.534-6.726-21.129-7.32-3.178-.248-7.475.186-10.47 1.993-2.995-1.807-7.292-2.24-10.47-1.992-7.596.593-14.895 3.092-21.13 7.32-3.085 2.091-5.597 4.781-8.13 7.447-1.01 1.062-4.782 5.763-6.633 4.88-.61-.292-.735-2.595-.862-3.215a319.348 319.348 0 01-1.685-8.879C32.607 54.434 31.034 40.075 27.61 26c-.997 0-1.872 18.748-1.983 20.495-.452 7.094-.98 14.03-.305 21.131 1.164 12.249 2.377 27.608 11.71 36.962 8.434 8.451 20.678 10.218 31.24 15.553 1.36.687 3.163 1.535 5.108 2.23 2.049 1.563 6.113 2.629 10.794 2.629 4.91 0 9.141-1.173 11.08-2.862a46.96 46.96 0 004.475-1.997c10.56-5.336 22.805-7.102 31.238-15.553 9.334-9.354 10.547-24.713 11.712-36.962.674-7.1.146-14.037-.306-21.131-.112-1.747-.986-20.495-1.982-20.495z" fill="'.concat(l,'"/>\n')},moustaceFancy:function(l){return '\n<path d="M57.548 69.678c1.627-.975 3.207-1.922 4.84-2.546 5.19-1.983 14.82-1.42 21.612 2.165 6.792-3.586 16.422-4.148 21.612-2.165 1.633.624 3.213 1.57 4.84 2.546 4.125 2.473 8.551 5.126 14.91 3.15.369-.114.729.217.618.58-1.373 4.51-9.007 7.599-11.601 7.7-6.207.242-11.753-2.261-17.126-4.686-4.444-2.006-8.77-3.958-13.253-4.26-4.483.302-8.809 2.254-13.252 4.26-5.374 2.425-10.92 4.928-17.126 4.686-2.594-.101-10.228-3.19-11.602-7.7-.11-.363.25-.694.619-.58 6.358 1.976 10.784-.677 14.91-3.15z" fill="'.concat(l,'"/>\n')},moustacheMagnum:function(l){return '\n<path d="M83.998 66.938c-2.5-3.336-12.267-4.749-19.277-3.474-9.653 1.757-13.744 12.303-12.506 14.215.772 1.191 2.482.793 4.26.379.814-.19 1.642-.383 2.401-.428 1.486-.089 3.34.218 5.446.567 4.981.824 11.37 1.88 17.628-1.508a6.041 6.041 0 002.048-1.85 6.041 6.041 0 002.048 1.85c6.257 3.389 12.647 2.332 17.628 1.508 2.106-.349 3.96-.656 5.446-.567.759.045 1.587.238 2.401.428 1.778.414 3.488.812 4.26-.379 1.238-1.912-2.853-12.458-12.507-14.215-7.009-1.275-16.775.138-19.276 3.474z" fill="'.concat(l,'"/>\n')}},o={concerned:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M35.118 29.872C36.176 20.38 44.226 13 54 13c9.804 0 17.874 7.426 18.892 16.96.082.767-.775 2.04-1.85 2.04H37.088c-1.08 0-2.075-1.178-1.97-2.128z" fill="#000" fill-opacity=".7"/>\n<path d="M69.586 32H38.414c1.306-4.617 5.55-8 10.586-8 1.8 0 3.5.433 5 1.2 1.5-.767 3.2-1.2 5-1.2 5.035 0 9.28 3.383 10.586 8z" fill="#FF4F6D"/>\n<path d="M66.567 17.75c-.493.162-1.02.25-1.567.25H44a4.98 4.98 0 01-2.243-.53A18.923 18.923 0 0154 13c4.818 0 9.218 1.794 12.567 4.75z" fill="#fff"/>\n'},default:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M40 15c0 7.732 6.268 14 14 14s14-6.268 14-14" fill="#000" fill-opacity=".7"/>\n'},disbelief:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M40 29c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#000" fill-opacity=".7"/>\n'},eating:function(){return '\n<path d="M28 26.244c1.358.488 2.84.756 4.392.756 5.322 0 9.821-3.153 11.294-7.486 2.475 2.156 6.177 3.525 10.314 3.525 4.137 0 7.84-1.37 10.314-3.525C65.787 23.847 70.286 27 75.608 27c1.552 0 3.034-.268 4.392-.756h-.054l-.063.001h-.06c-6.33 0-11.803-4.9-11.803-10.568 0-4.182 2.32-7.718 5.687-9.677-5.5.797-9.725 4.995-9.898 10.106-2.564 1.736-6.014 2.8-9.809 2.8-3.795 0-7.245-1.064-9.81-2.8-.172-5.11-4.398-9.309-9.896-10.106 3.366 1.959 5.687 5.495 5.687 9.677 0 5.668-5.474 10.568-11.804 10.568H28z" fill="#000" fill-opacity=".6" opacity=".6"/>\n<path d="M17 24a9 9 0 100-18 9 9 0 000 18zm74 0a9 9 0 100-18 9 9 0 000 18z" fill="#FF4646" fill-opacity=".2"/>\n'},grimace:function(){return '\n<rect x="22" y="7" width="64" height="26" rx="13" fill="#000" fill-opacity=".6"/>\n<rect x="24" y="9" width="60" height="22" rx="11" fill="#fff"/>\n<path d="M24.181 18H32V9.414A11 11 0 0135 9h1v9h9V9h4v9h9V9h4v9h9V9h2c.683 0 1.351.062 2 .181V18h8.819l.048.282v3.436l-.048.282H75v8.819c-.649.119-1.317.181-2 .181h-2v-9h-9v9h-4v-9h-9v9h-4v-9h-9v9h-1a11 11 0 01-3-.414V22h-7.819a11.057 11.057 0 010-4z" fill="#E6E6E6"/>\n'},sad:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M40.058 27.723C40.708 20.693 46.702 16 54 16c7.342 0 13.363 4.75 13.953 11.848.03.378-.876.676-1.324.451-5.539-2.772-9.749-4.159-12.63-4.159-2.843 0-6.992 1.356-12.445 4.069-.507.252-1.534-.069-1.496-.486z" fill="#000" fill-opacity=".7"/>\n'},screamOpen:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M34.008 38.864C35.128 24.876 38.234 13.008 53.996 13c15.762-.008 18.92 11.943 19.998 25.994.087 1.13-.82 2.006-1.957 2.006-6.687 0-9.367-1.994-18.048-2-8.68-.006-13.232 2-17.896 2-1.144 0-2.197-.737-2.085-2.136z" fill="#000" fill-opacity=".7"/>\n<path d="M67.024 17.573A4.982 4.982 0 0165 18H44a4.977 4.977 0 01-2.672-.773c2.897-2.66 6.95-4.224 12.668-4.227 5.95-.003 10.104 1.698 13.028 4.573z" fill="#fff"/>\n<path d="M69.804 40.922c-2.05-.146-3.757-.477-5.547-.824C61.53 39.57 58.61 39.003 53.99 39c-5.013-.004-8.65.664-11.725 1.229-1.45.266-2.774.509-4.06.648C39.195 35.818 43.652 32 49 32c1.8 0 3.5.433 5 1.2 1.5-.767 3.2-1.2 5-1.2 5.365 0 9.832 3.84 10.804 8.922z" fill="#FF4F6D"/>\n'},serious:function(){return '\n<rect x="42" y="18" width="24" height="6" rx="3" fill="#000" fill-opacity=".7"/>\n'},smile:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M35.118 15.128C36.176 24.62 44.226 32 54 32c9.804 0 17.874-7.426 18.892-16.96.082-.767-.775-2.04-1.85-2.04H37.088c-1.08 0-2.075 1.178-1.97 2.128z" fill="#000" fill-opacity=".7"/>\n<path d="M70 13H39a5 5 0 005 5h21a5 5 0 005-5z" fill="#fff"/>\n<path d="M66.694 27.138A10.964 10.964 0 0059 24c-1.8 0-3.5.433-5 1.2-1.5-.767-3.2-1.2-5-1.2-2.995 0-5.71 1.197-7.693 3.138A18.93 18.93 0 0054 32c4.88 0 9.329-1.84 12.694-4.862z" fill="#FF4F6D"/>\n'},tongue:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M29 15.609C30.41 25.23 41.062 33 54 33c12.968 0 23.646-7.817 25-18.26.101-.4-.225-1.74-2.174-1.74H31.174c-1.79 0-2.304 1.24-2.174 2.609z" fill="#000" fill-opacity=".7"/>\n<path d="M70 13H39a5 5 0 005 5h21a5 5 0 005-5z" fill="#fff"/>\n<path d="M43 23.5l.001.067-.001.063v8.87C43 38.851 48.149 44 54.5 44S66 38.851 66 32.5v-8.87l-.001-.063L66 23.5c0-1.933-2.91-3.5-6.5-3.5-2.01 0-3.808.491-5 1.264-1.192-.773-2.99-1.264-5-1.264-3.59 0-6.5 1.567-6.5 3.5z" fill="#FF4F6D"/>\n'},twinkle:function(){return '\n<path d="M40 16c0 5.372 6.158 9 14 9s14-3.628 14-9c0-1.105-.95-2-2-2-1.293 0-1.87.905-2 2-1.242 2.938-4.317 4.716-10 5-5.683-.284-8.758-2.062-10-5-.13-1.095-.707-2-2-2-1.05 0-2 .895-2 2z" fill="#000" fill-opacity=".6"/>\n'},vomit:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M34.008 30.398c1.12-10.49 4.226-19.392 19.988-19.398 15.762-.006 18.92 8.957 19.998 19.495.087.848-.82 1.505-1.957 1.505-6.687 0-9.367-1.495-18.048-1.5-8.68-.005-13.232 1.5-17.896 1.5-1.144 0-2.197-.552-2.085-1.602z" fill="#000" fill-opacity=".7"/>\n<path d="M67.862 15.1c-.81.567-1.798.9-2.862.9H44a4.982 4.982 0 01-3.376-1.311c2.933-2.31 7.174-3.687 13.372-3.689 6.543-.002 10.914 1.54 13.866 4.1z" fill="#fff"/>\n<path d="M42 25a6 6 0 00-6 6v7a6 6 0 0012 0v-2h.083a6.002 6.002 0 0111.834 0H60a6 6 0 0012 0v-5a6 6 0 00-6-6H42z" fill="#7BB24B"/>\n<path d="M72 31a6 6 0 00-6-6H42a6 6 0 00-6 6v6a6 6 0 0012 0v-2h.083a6.002 6.002 0 0111.834 0H60a6 6 0 0012 0v-4z" fill="#88C553"/>\n'}},f=function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M16 8c0 4.418 5.373 8 12 8s12-3.582 12-8" fill="#000" fill-opacity=".16"/>\n'},u=function(l){return '\n<path d="M100 0C69.072 0 44 25.072 44 56v6.166c-5.675.952-10 5.888-10 11.834v14c0 6.052 4.48 11.058 10.305 11.881 2.067 19.806 14.458 36.541 31.695 44.73V163h-4c-39.764 0-72 32.236-72 72v9h200v-9c0-39.764-32.236-72-72-72h-4v-18.389c17.237-8.189 29.628-24.924 31.695-44.73C161.52 99.058 166 94.052 166 88V74c0-5.946-4.325-10.882-10-11.834V56c0-30.928-25.072-56-56-56z" fill="'.concat(l,'"/>\n<path d="M76 144.611v8A55.79 55.79 0 00100 158a55.789 55.789 0 0024-5.389v-8A55.789 55.789 0 01100 150a55.79 55.79 0 01-24-5.389z" fill="#000" fill-opacity=".1"/>\n')},p={eyepatch:{path:function(){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M160.395 39.781c-3.077-3.088-6.276 3.858-7.772 5.647-3.61 4.32-7.083 8.755-10.755 13.024-7.252 8.43-14.429 16.922-21.634 25.388-1.094 1.286-.961 1.425-2.397 1.549-.951.082-2.274-.409-3.263-.463-2.75-.151-5.462.309-8.138.897-5.345 1.173-11.01 3.106-15.647 6.075-1.217.78-2.002 1.7-3.322 1.943-1.149.212-2.673-.211-3.845-.322-2.08-.195-5.084-1.046-7.127-.605-2.592.56-3.578 3.697-.934 5.086 2.01 1.056 6.01.476 8.263.645 2.573.192 1.788.06 1.423 2.519-.523 3.534.352 7.482 1.842 10.714 3.46 7.505 13.034 15.457 21.766 14.725 7.287-.611 13.672-7.19 16.664-13.503 1.532-3.231 2.436-6.908 2.731-10.472.189-2.266.084-4.67-.566-6.865-.321-1.085-.83-2.208-1.376-3.194-.442-.798-2.399-2.649-2.519-3.452-.233-1.557 4.184-5.73 5.027-6.773 3.973-4.916 7.964-9.812 11.906-14.755 3.881-4.869 7.784-9.725 11.768-14.51 1.804-2.17 10.828-10.364 7.905-13.298" fill="#28354B"/>\n'},isHat:!0,zIndex:0},turban:{path:function(l){return '\n<path d="M190.47 97.5c1.001-2.41 1.53-4.92 1.53-7.5 0-18.225-26.415-33-59-33S74 71.775 74 90c0 2.58.53 5.09 1.53 7.5C81.602 82.888 105.028 72 133 72c27.972 0 51.398 10.888 57.47 25.5z" fill="#EDECE3"/>\n<path d="M49 94.323C48.934 133.5 78 141 78 141c-5.442-49.552 23.536-65.151 46.529-77.529 2.94-1.582 5.783-3.112 8.443-4.654 2.67 1.55 5.525 3.087 8.48 4.678C164.429 75.87 193.418 91.48 188 141c0 0 29.066-8.46 29-46.677C216.918 47.148 164.851 3 135 3c-.674 0-1.344.03-2.008.088A22.544 22.544 0 00131 3c-29.926 0-81.92 44.148-82 91.323z" fill="'.concat(l,'"/>\n<path d="M49.014 95.9C49.716 133.7 78 141 78 141s-29.066-7.066-29-43.97c.001-.377.005-.754.014-1.13zm28.32 33.78c.15-37.857 26.174-51.054 47.195-61.714 11.005-5.58 20.639-10.466 24.471-17.83 4.126-7.247 5.39-13.94 4.646-19.668-.505 4.367-1.976 9.099-4.646 14.076-3.832 7.818-13.466 13.004-24.471 18.928-21.142 11.38-47.345 25.486-47.195 66.208z" fill="#000" fill-opacity=".16"/>\n')},isHat:!0,zIndex:1},hijab:{path:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M65.996 77.34A68.436 68.436 0 0065 89v48c0 .973.02 1.942.06 2.905-.02.823-.04 1.527-.06 2.095.138 3.68-1.857 11.795-4.34 21.897-3.876 15.776-8.944 36.399-8.944 52.549 0 13.015 1.983 22.845 3.89 32.297C57.582 258.528 59.475 267.908 59 280h47s-.948-13.209-2.473-26.357c10.051 10.206 22.824 16.833 39.05 16.833 70.549 0 77.623-53.827 77.623-65.233 0-6.04-4.322-10.885-8.386-15.441-3.612-4.049-7.02-7.869-7.011-12.097.009-4.353 1.03-7.395 2.08-10.523 1.117-3.327 2.267-6.753 2.267-11.962 0-5.82-1.432-7.51-2.909-9.255-1.088-1.284-2.201-2.598-2.785-5.611-.881-4.546-1.863-14.324-2.456-20.776V89c0-37.555-30.445-68-68-68-33.487 0-61.321 24.206-66.958 56.076L66 77l-.004.34zM133 53c-30.1 0-55 24.4-55 54.5v23c0 30.1 24.9 54.5 55 54.5s55-24.4 55-54.5v-23c0-30.1-24.9-54.5-55-54.5z" fill="'.concat(l,'"/>\n<path d="M193.926 104.96A61.39 61.39 0 00195 93.5c0-33.965-27.758-61.5-62-61.5-34.242 0-62 27.535-62 61.5 0 3.916.369 7.747 1.074 11.46C73.66 72.683 100.33 47 133 47s59.341 25.683 60.926 57.96z" fill="#fff" fill-opacity=".5"/>\n<path d="M78.073 104.686A54.7 54.7 0 0078 107.5v23c0 30.1 24.9 54.5 55 54.5s55-24.4 55-54.5v-23c0-.944-.024-1.882-.073-2.814A54.72 54.72 0 01189 115.5v23c0 30.1-24.4 54.5-54.5 54.5h-3c-30.1 0-54.5-24.4-54.5-54.5v-23c0-3.703.37-7.319 1.073-10.814zm108.977 89.458c-4.388 6.903-17.904 13.661-34.645 16.612-16.742 2.952-31.754 1.225-38.238-3.761.022.261.056.521.101.78 1.71 9.695 19.427 14.675 39.572 11.123 20.145-3.553 35.091-14.292 33.381-23.987a9.041 9.041 0 00-.171-.767zm11.61 15.344c-2.641 9.597-14.874 20.212-31.556 26.284-16.682 6.072-32.877 5.803-41.069.149.096.338.205.673.326 1.005 4.527 12.437 24.47 16.596 44.544 9.29 20.074-7.307 32.678-23.312 28.151-35.749a14.938 14.938 0 00-.396-.979z" opacity=".9" fill="#000" fill-opacity=".16"/>\n')},isHat:!0,zIndex:1},hat:{path:function(l){return '\n<path d="M188.318 138.763C227.895 129.257 255 109.871 255 87.5c0-23.505-29.924-43.716-72.796-52.632l-.314-1.432C177.867 15.08 161.609 2 142.818 2h-18.636C105.391 2 89.133 15.08 85.11 33.436l-.267 1.217C41.412 43.456 11 63.804 11 87.5c0 22.371 27.105 41.757 66.682 51.263a56.124 56.124 0 01-.473-3.896C71.43 134.002 67 129.019 67 123v-13c0-5.946 4.325-10.882 10-11.834V92a55.808 55.808 0 014.71-22.514c8.603-15.683 92.725-16.486 102.652.163A55.821 55.821 0 01189 92v6.166c5.675.952 10 5.888 10 11.834v13c0 6.019-4.431 11.002-10.209 11.867a56.063 56.063 0 01-.473 3.896z" fill="'.concat(l,'"/>\n<path d="M189 92.743c3.847-3.255 6-6.897 6-10.743 0-6.079-5.38-11.65-14.325-15.984 1.646 1.102 2.9 2.313 3.687 3.633A55.821 55.821 0 01189 92v.743zm-31.737-33.756C149.811 57.707 141.611 57 133 57c-8.981 0-17.516.77-25.221 2.155 15.165-2.205 34.115-2.303 49.484-.168zm-72.577 7.344C76.124 70.618 71 76.068 71 82c0 3.846 2.153 7.488 6 10.743V92a55.808 55.808 0 014.71-22.514c.62-1.13 1.63-2.181 2.976-3.155z" fill="#000" fill-opacity=".5"/>\n')},isHat:!0,zIndex:0},winterHat01:{path:function(l){return '\n<path d="M86.671 68H64v112.912A4.088 4.088 0 0068.088 185c10.264 0 18.583-8.32 18.583-18.583V68zM202 68h-22.671v112.912a4.088 4.088 0 004.088 4.088C193.68 185 202 176.68 202 166.417V68z" fill="#F4F4F4"/>\n<path d="M63 64c0-24.3 19.7-44 44-44h52c24.301 0 44 19.7 44 44v104.607c0 9.053-7.34 16.393-16.393 16.393a3.607 3.607 0 01-3.607-3.607V74H83v94.607C83 177.66 75.66 185 66.607 185A3.607 3.607 0 0163 181.393V64z" fill="'.concat(l,'"/>\n<rect x="74" y="52" width="118" height="36" rx="8" fill="#000" fill-opacity=".1"/>\n<rect x="74" y="50" width="118" height="36" rx="8" fill="#F4F4F4"/>\n')},isHat:!0,zIndex:2},winterHat02:{path:function(l){return '\n<path d="M197 168h-2v56.055a9 9 0 102 0V168zm-126 8h-2v56.055a9 9 0 102 0V176z" fill="#F4F4F4"/>\n<circle cx="133" cy="20" r="20" fill="#F4F4F4"/>\n<path d="M93.449 77.535h79.102c6.084 0 9.816 2.925 9.816 9v79.454c0 30.458 22.633 30.416 22.633 10.921v-73.865C205 68.803 187.773 21 133 21c-54.773 0-72 47.803-72 82.045v73.865c0 19.495 22.633 19.537 22.633-10.921V86.535c0-6.075 3.732-9 9.816-9z" fill="'.concat(l,'"/>\n<path d="M198.671 67H67.329C76.416 42.505 96.262 21 133 21c36.737 0 56.584 21.505 65.671 46z" fill="#000" fill-opacity=".2"/>\n<path d="M91.205 33.735L102.5 50 115 32H93.664a60.51 60.51 0 00-2.46 1.735zM172.336 32H152l12.5 18 10.951-15.77a60.556 60.556 0 00-3.115-2.23zM133.5 50L121 32h25l-12.5 18z" fill="#fff" fill-opacity=".5"/>\n<path d="M99 59L86.5 41 74 59h25zm31 0l-12.5-18L105 59h25zm18.5-18L161 59h-25l12.5-18zM192 59l-12.5-18L167 59h25z" fill="#000" fill-opacity=".5"/>\n')},isHat:!0,zIndex:2},winterHat03:{path:function(l){return '\n<circle cx="133" cy="20" r="20" fill="#F4F4F4"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M67 78c0-36.45 29.55-66 66-66 36.451 0 66 29.55 66 66v5H67v-5z" fill="'.concat(l,'"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M64 69.772c0-2.389 1.058-4.64 3.046-5.963C74.846 58.62 97.47 46 133.073 46c35.606 0 58.137 12.62 65.898 17.81 1.979 1.323 3.029 3.567 3.029 5.947V99.95c0 3.306-3.907 5.385-6.783 3.756C184.842 97.829 163.109 88 133.804 88c-29.759 0-52.525 10.137-63.172 15.977-2.853 1.565-6.632-.496-6.632-3.749V69.772z" fill="#000" fill-opacity=".1"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M64 67.772c0-2.389 1.058-4.64 3.046-5.963C74.846 56.62 97.47 44 133.073 44c35.606 0 58.137 12.62 65.898 17.81 1.979 1.323 3.029 3.567 3.029 5.947V97.95c0 3.306-3.907 5.385-6.783 3.756C184.842 95.829 163.109 86 133.804 86c-29.759 0-52.525 10.137-63.172 15.977-2.853 1.565-6.632-.496-6.632-3.75V67.773z" fill="#F4F4F4"/>\n')},isHat:!0,zIndex:2},winterHat04:{path:function(l){return '\n<path d="M67 65c0-8.16 1.603-15.947 4.51-23.06-3.87-8.946-8.335-22.964-3.874-32.82 8.002-2.427 17.806 1.335 25.635 5.725C103.127 8.007 115.096 4 128 4h10c12.916 0 24.894 4.014 34.755 10.862 7.833-4.398 17.652-8.172 25.664-5.742 4.473 9.88-.026 23.942-3.902 32.884A60.815 60.815 0 01199 65v8H67v-8z" fill="'.concat(l,'"/>\n<path d="M194.517 42.005c3.876-8.943 8.375-23.005 3.902-32.885-8.012-2.43-17.831 1.344-25.664 5.742 9.649 6.702 17.272 16.118 21.762 27.142zM93.27 14.845c-7.828-4.39-17.632-8.152-25.634-5.725-4.461 9.856.005 23.874 3.874 32.82 4.498-11.007 12.118-20.405 21.76-27.095z" fill="#000" fill-opacity=".24"/>\n<path d="M190.2 33.42c1.986-6.006 3.49-12.863 1.486-16.106-2.669-1.154-7.583.48-12.403 2.778A61.281 61.281 0 01190.2 33.42zM86.66 20.144c-4.925-2.38-10.003-4.116-12.733-2.936-2.058 3.33-.417 10.47 1.647 16.589A61.277 61.277 0 0186.66 20.144z" fill="#fff" fill-opacity=".3"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M64 69.772c0-2.389 1.058-4.64 3.046-5.963C74.846 58.62 97.47 46 133.073 46c35.606 0 58.137 12.62 65.898 17.81 1.979 1.323 3.029 3.567 3.029 5.947V99.95c0 3.306-3.907 5.385-6.783 3.756C184.842 97.829 163.109 88 133.804 88c-29.759 0-52.525 10.137-63.172 15.977-2.853 1.565-6.632-.496-6.632-3.749V69.772z" fill="#000" fill-opacity=".1"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M64 67.772c0-2.389 1.058-4.64 3.046-5.963C74.846 56.62 97.47 44 133.073 44c35.606 0 58.137 12.62 65.898 17.81 1.979 1.323 3.029 3.567 3.029 5.947V97.95c0 3.306-3.907 5.385-6.783 3.756C184.842 95.829 163.109 86 133.804 86c-29.759 0-52.525 10.137-63.172 15.977-2.853 1.565-6.632-.496-6.632-3.75V67.773z" fill="#F4F4F4"/>\n')},isHat:!0,zIndex:2},bigHair:{path:function(l){return '\n<path d="M44.826 105.591c-.382-1.606-.769-3.229-1.124-4.91-1.952-9.236-2.956-20.223 2.884-39.676-6.903 22.995-4.243 34.16-1.76 44.586 1.238 5.196 2.432 10.208 2.377 16.409.02 2.295-.38 4.285-1.104 6.057.723-1.772 1.124-3.762 1.104-6.057.055-6.201-1.14-11.213-2.377-16.409zm173.55 8.643c-.131.386-.156.805-.173 1.226.053-.412.111-.821.173-1.226zm-.33 2.579a47.23 47.23 0 00-.223 3.347c-29.04-10.756-54.946-29.617-70.328-51.548-12.093 15.618-31.955 23.04-51.622 30.391-17.386 6.498-34.619 12.939-46.2 24.933.388-.544.755-1.051 1.086-1.49 10.998-14.601 28.764-21.887 46.7-29.242 18.816-7.716 37.817-15.508 49.387-31.902 15.398 24.088 41.819 44.648 71.163 55.625.014-.038.026-.076.037-.114z" fill="#000" fill-opacity=".16"/>\n<path d="M32.005 280H33v-9c0-39.764 32.236-72 72-72h4v-18.389c-17.53-8.328-30.048-25.496-31.791-45.744C71.43 134.002 67 129.019 67 123v-13c0-.794.077-1.569.224-2.32 9.114-5.815 19.645-10.133 30.235-14.476 18.815-7.716 37.817-15.508 49.386-31.902 11.958 18.706 30.562 35.283 52.021 46.898.088.587.134 1.188.134 1.8v13c0 6.019-4.431 11.002-10.209 11.867-1.743 20.248-14.26 37.416-31.791 45.744V199h4c39.764 0 72 32.236 72 72v9c24.414-13.94 15.859-33.211 6.284-48.463-1.368-2.179-2.756-4.276-4.073-6.264-3.479-5.255-6.453-9.746-7.201-12.97a6.578 6.578 0 01-.179-1.303c-.144-4.617 3.141-7.836 7.164-11.777 6.21-6.084 14.178-13.891 14.008-31.223-.514-15.834-9.801-22.253-18.109-27.995-6.924-4.785-13.168-9.101-13.091-18.005a46.419 46.419 0 01.244-5.189c.118-.4.135-.828.152-1.254l.004-.093c.444-3.443 1.202-6.622 1.976-9.873 2.555-10.725 5.295-22.232-2.376-46.591-2.91-9.115-6.971-16.5-12.101-22.461-14.127-16.419-36.354-22.041-64.906-23.289a297.772 297.772 0 00-7.793-.234V13l-.5.008-.5-.008c-43.086.768-73.163 9.54-84.8 46-7.672 24.36-4.931 35.866-2.377 46.591 1.238 5.196 2.432 10.208 2.377 16.409.032 3.753-1.059 6.691-2.85 9.193-2.459 3.433-6.237 6.044-10.242 8.812-8.308 5.742-17.595 12.161-18.108 27.995-.17 17.332 7.797 25.139 14.007 31.223 4.023 3.941 7.308 7.16 7.164 11.777-.087 3.259-3.403 8.267-7.38 14.273-10.53 15.901-25.69 38.795 2.211 54.727z" fill="'.concat(l,'"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M50.58 122.446c22.536-29.919 73.489-29.122 96.087-61.144 15.398 24.088 41.819 44.648 71.164 55.625.301-.854.08-1.85.367-2.694 2.155-14.144 9.144-24.378-.574-55.233-11.637-36.46-41.714-45.232-84.8-45.984a465.51 465.51 0 00-1-.016c-43.086.768-73.163 9.54-84.8 46-11.388 36.16.17 43.999 0 63 .033 3.753-1.058 6.691-2.85 9.193.184.402 4.154-5.756 6.406-8.747z" fill="#fff" fill-opacity=".2"/>\n')},isHat:!1,zIndex:0},bob:{path:function(l){return '\n<path d="M40 145c-.617-30.836 28.319-95.205 39-108 7.923-9.491 29.695-17.45 54-17 24.305.45 46.862 5.812 55 16 12.324 15.428 37.869 74.079 38 109 .093 24.8-9.537 49.66-23 51-7.601.757-17.257-.226-28.859-1.406-5.309-.54-11.026-1.121-17.141-1.597v-12.386c18.92-8.988 32-28.272 32-50.611v-28.436c-10.509-5.79-19.455-12.78-26.909-19.882 3.356 6.24 7.194 11.908 11.522 16.191-30.582-8.58-51.724-26.152-64.393-39.93-5.825 11.08-16.257 27.282-32.22 39.625V130c0 22.339 13.08 41.623 32 50.611v13.135c-6.952.951-13.414 2.159-19.36 3.271h-.002c-10.849 2.028-19.983 3.735-27.254 2.983-14.222-1.469-21.888-30.204-22.384-55z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:0},bun:{path:function(l){return '\n<path d="M151.117 28.283C154.176 25.31 156 21.568 156 17.5 156 7.835 145.703 0 133 0s-23 7.835-23 17.5c0 4.093 1.846 7.857 4.94 10.837-.986.222-1.954.454-2.903.693-15.092 3.808-24.02 14.621-31.68 30.618-3.761 7.855-5.991 17.143-6.334 25.833-.135 3.412.325 6.934 1.245 10.22.337 1.205 2.155 5.386 2.654 2.008.099-.665-.073-1.478-.243-2.279-.117-.554-.233-1.103-.257-1.592-.078-1.569.005-3.157.112-4.723.2-2.928.722-5.8 1.65-8.59 1.328-3.988 3.017-8.312 5.603-11.677.96-1.248 1.878-2.697 2.87-4.265C93.294 55.686 101.345 42.975 133 41.67c34.303-1.414 46.776 21.666 51.213 29.875.379.702.699 1.295.97 1.755 2.666 4.534 2.779 9.746 2.891 14.911.059 2.711.118 5.41.545 7.989.472 2.85 1.545 2.786 2.132.237.997-4.33 1.468-8.828 1.151-13.279-.718-10.048-4.405-36.453-24.593-48.153-5.442-3.154-10.871-5.319-16.192-6.723z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:1},curly:{path:function(l){return '\n<path d="M67 105.022c11.383-.72 24.676-14.395 31.98-33.943C108.789 72.94 120.04 74 132 74c12.547 0 24.312-1.165 34.45-3.2 7.381 19.964 21.012 33.873 32.55 34.244V88c0-26.44-15.548-49.25-38.001-59.784C152.183 26.794 142.358 26 132 26c-9.204 0-17.987.627-26.015 1.764C83.004 38.087 67 61.174 67 88v17.022z" fill="#000" fill-opacity=".16"/>\n<path d="M73 192c4.72 0 9.281-.681 13.59-1.951a72.078 72.078 0 0013.689 9.103A73.084 73.084 0 01105 199h4v-18.389c-17.53-8.328-30.048-25.496-31.791-45.744C71.43 134.002 67 129.019 67 123v-13a12 12 0 0110-11.834v-.743c8.464-5.38 16.755-16.359 21.98-30.344C108.789 68.94 120.04 70 132 70c12.547 0 24.312-1.165 34.45-3.2 5.315 14.375 13.869 25.61 22.55 30.913v.453c.438.073.868.17 1.289.29a24.39 24.39 0 003.235 1.471A11.989 11.989 0 01199 110v13c0 6.019-4.431 11.002-10.209 11.867-1.743 20.248-14.26 37.416-31.791 45.744V199h4c1.586 0 3.161.051 4.721.152a72.081 72.081 0 0013.689-9.103A48.001 48.001 0 00193 192c26.51 0 48-21.49 48-48 0-14.409-6.349-27.335-16.402-36.134A43.804 43.804 0 00233 82c0-21.84-15.911-39.962-36.774-43.41C189.981 21.89 173.879 10 155 10a43.8 43.8 0 00-22 5.886A43.8 43.8 0 00111 10c-18.88 0-34.981 11.89-41.226 28.59C48.91 42.038 33 60.16 33 82a43.8 43.8 0 008.402 25.866C31.35 116.665 25 129.591 25 144c0 26.51 21.49 48 48 48z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:0},curvy:{path:function(l){return '\n<path d="M89.398 84.205c-4.878 1.298-9.644 2.77-14.408 4.331C63.871 92.18 68.316 82.432 72 74.5l111.785-9.523c6.033 7.332 24.839 41.013 7.133 26.999-3.093-2.448-9.57-4.449-12.661-7.263-2.337-2.127-5.157-1.787-6.276-4.48l-2.547.905c-1.735-.537-10.524-3.537-11.978-4.128l-.549-1.077-1.666.638c-1.781-.07-9.121-.328-9.121-.328-2.632-.032-13.729.218-16.285.426 0 0-1.223-.916-2.939-2.68l-1.33 3.224s-11.921 1.791-14.079 1.957l-1.062-1.955-2.736 2.98c-3.891.896-13.834 2.824-18.29 4.01z" fill="#000" fill-opacity=".16"/>\n<path d="M48.603 123.036c-5.696-17.86 2.748-37.124 11.113-47.262 1.487-1.802 3.069-5.117 5.064-9.296 8.34-17.475 23.892-50.058 69.807-50.28 49.924-.24 59.746 36.018 63.649 50.428 1.649 6.088 4.558 11.594 7.38 17.219 4.007 7.987 8.396 16.733 9.905 23.042 1.085 4.539 1.693 9.048 1.165 13.696-.121 1.066-1.077 4.228-.476 4.858.542.57 1.877 1.146 3.091 1.669 9.024 3.89 16.11 10.401 19.817 19.624 4.707 11.714-.996 25.468-11.264 32.161-1.396.91-.743 2.697-.768 4.115-.142 7.944-1.652 16.02-4.328 23.487-1.414 3.948-3.168 7.921-6.533 10.98-2.845 2.586-6.936 4.423-10.852 5.519-1.356.379-1.337.783-1.415 1.176-1.15 5.76 2.706 13.116 4.602 18.554 1.495 4.291 2.994 8.592 3.804 13.002 1.18 6.424-3.024 27.818-14.12 22.796 5.519-2.635 5.759-8.259 3.875-9.833-4.336-3.622-11.757-1.59-16.898-.743-3.71.612-7.627 1.257-11.147.435-3.686-.862-7.497-2.641-10.602-4.84-17.648-13.969-13.846-37.047 1.067-64.402l-.547-.035c-1.107-.07-1.669-.106-2.992-.106h-4v-18.389c18.92-8.988 32-28.272 32-50.611V92a56.73 56.73 0 00-.169-4.382c-1.113-.625-2.377-1.235-3.662-1.855-2.58-1.245-5.24-2.529-6.912-4.05-.97-.883-2.023-1.34-3.003-1.767-1.382-.6-2.618-1.138-3.273-2.714l-2.547.906c-1.735-.537-10.524-3.537-11.977-4.128l-.549-1.077-1.667.638c-1.781-.07-9.121-.328-9.121-.328-2.631-.032-13.729.218-16.285.426 0 0-1.222-.916-2.939-2.68l-1.33 3.224s-11.92 1.791-14.078 1.957l-1.063-1.955-2.736 2.98c-1.421.327-3.649.792-6.123 1.308-4.299.897-9.338 1.949-12.167 2.702-4.033 1.073-7.99 2.265-11.932 3.529A56.53 56.53 0 0077 92v38c0 22.339 13.08 41.623 32 50.611V199h-4a72.2 72.2 0 00-16.39 1.874c-.111.166-.231.314-.335.494-4.777 6.948-13.868 12.389-17.452 19.494-1.471 2.916.182 7.833 1.659 10.557 3.197 5.897 11.146 8.656 19.518 7.329-2.529 2.123-7.549 3.823-10.953 3.943-4.628.165-10.285-1.622-14.262-3.582.604 3.6 2.687 5.614 4.624 8.598-5.521-.285-10.884-7.068-12.683-12.053-2.197 4.508-3.433 16.636-2.343 20.031-14.139-6.341-25.135-19.444-24.303-35.669.541-10.555 7.15-18.906 9.48-28.888.46-1.97.144-2.384-1.05-3.95l-.052-.068c-4.374-5.734-9.617-10.686-12.43-17.477-2.54-6.137-2.625-13.182-.643-19.507 2.217-7.075 9.06-14.152 14.848-20.136 2.46-2.543 4.728-4.89 6.37-6.954z" fill="'.concat(l,'"/>\n<path d="M164.504 199.205l.256-.064s4.441-9.021 11.246-17.384c-1.324-10.43 5.868-23.709 5.868-23.709l-.351-.073A56.246 56.246 0 01157 180.611V199h4c1.323 0 1.885.036 2.992.106h.001l.546.035-.035.064zm-82.238-45.467a91.86 91.86 0 00-.138.063c6.021 9.986 13.628 36.954 6.552 46.661.082.114.167.226.254.337A72.25 72.25 0 01105 199h4v-18.389a56.227 56.227 0 01-26.734-26.873z" fill="#000" fill-opacity=".24"/>\n<path d="M118.377 50.373c1.516-1.856 2.889-3.831 3.503-6.165.23-.873.467-1.776.885-2.313-4.756 4.993-8.801 9.92-12.302 15.632.78-1.021 2.741-2.021 3.764-2.91a34.94 34.94 0 004.15-4.244zm53.132-8.39c-.305 3.49.465 6.933.623 10.407 0-.348.333-.927.652-1.48.764-1.328 1.126-2.881.913-4.417-.14-1.007-.547-1.954-1.064-2.856-.207-.361-1.123-1.322-1.124-1.654zM56.41 120.375a88.612 88.612 0 004.456 18.003c2.062 5.721 4.42 11.458 7.812 16.69 3.162 4.875 6.925 9.424 9.957 14.361-.463-.551-1.223-1.17-1.904-1.726-.49-.4-.941-.768-1.21-1.052-3.222-3.403-5.813-7.196-8.278-11.041-3.252-5.073-5.69-10.576-7.803-16.079-4.14-10.781-8.292-23.849-4.693-35.245-.201.777.49 2.432.602 3.211.615 4.275.467 8.607 1.06 12.878z" fill="#fff" fill-opacity=".6"/>\n<path d="M54.774 104.201a.762.762 0 00-.027.085l.027-.085zm23.861 65.228c.49.583.344.561 0 0zm-9.78-4.388c-2.452-3.546-5.045-7.166-7.082-10.905-1.78-3.267-3.058-6.851-5.292-9.851-.325-.437-.718-.963-.791-1.316.67 6.153 3.44 12.742 7.723 17.31 1.56 1.665 4.084 3.031 5.442 4.762zm-4.775 6.281c3.551 3.816 6.944 7.762 9.452 12.177 1.744 3.07 3.215 6.641 3.458 10.211.037.535.083 1.208.195 1.574-2.215-4.291-3.905-8.835-6.543-12.942-2.604-4.054-5.947-7.781-9.446-11.281-3.695-3.695-7.41-7.182-9.392-11.847-1.725-4.06-2.391-8.218-1.99-12.556.001 1.242.742 2.82 1.427 4.281 1.473 3.139 2.07 6.61 3.673 9.695 2.125 4.089 5.959 7.243 9.165 10.688zm-4.851 2.857c-.505-.485-2.41-1.684-2.746-2.299l-.03-.063a.59.59 0 00.03.063c.707 1.493 1.479 2.953 2.213 4.432 1.532 3.078 3.715 5.71 5.939 8.392.357.431.715.863 1.072 1.298-.796-1.016-1.02-3.281-1.527-4.498-1.157-2.78-2.776-5.234-4.951-7.325zm-10.326 6.349c1.148 1.72 2.44 3.372 3.731 5.023 1.9 2.429 3.799 4.858 5.243 7.505 2.83 5.187 4.075 10.807 4.326 16.54.119 2.711.112 5.465-.253 8.168-.239 1.765-.54 3.595-1.22 5.249-.249.603-.543 1.319-.626 1.834-.064-2.319-.03-4.637.005-6.947.123-8.196.244-16.296-4.032-23.957-1.581-2.833-3.68-5.411-5.778-7.989-1.346-1.654-2.692-3.308-3.901-5.029-2.782-3.959-5.498-7.841-7.713-12.074 1.356 1.716 3.8 3.065 5.316 4.769 1.898 2.133 3.348 4.58 4.902 6.908zm11.201 44.319c-.085.528.01.397 0 0zm-9.563-20.845c.006-.502.011-1.005.02-1.508 0 .496.815 1.518 1.038 2.035 1.616 3.747 1.571 7.497.09 11.321-1.898 4.907-4.873 9.253-8.612 13.3.831-1.088 1.351-2.601 1.852-4.058 1.013-2.946 2.608-5.621 3.804-8.491 1.673-4.013 1.73-8.325 1.809-12.599zm-8.624 17.199c1.08-1.202 1.917-2.645 2.25-4.134.202-.907-.412-2.674.004-3.373-.779 1.133-1.457 2.362-1.849 3.635-.212.689-.004 3.324-.405 3.872zM84.863 64.317c3.849-3.401 6.913-7.155 9.77-11.193a34.607 34.607 0 003.22-5.605c.13-.283.29-.868.473-1.535.298-1.09.656-2.4 1.042-2.979-2.706 2.9-4.841 6.005-7.023 9.178-1.451 2.12-2.992 4.18-4.342 6.37-.359.581-.688 1.346-1.03 2.141-.59 1.368-1.219 2.83-2.11 3.623zm-1.021-8.631c.138-.617.272-1.214.47-1.564.75-1.327 1.893-2.448 3.18-3.414-.34.299-.57 1.15-.782 1.939-.145.54-.283 1.052-.443 1.336-.79 1.402-1.937 2.613-3.17 3.748.367-.354.56-1.217.745-2.045zm-.771 2.069a.726.726 0 00.026-.024l-.026.024zm120.722 92.839c.613-3.323 1.261-6.835 2.943-9.836.761-1.359 1.687-2.676 2.601-3.977l.003-.003a26.35 26.35 0 001.354-2.111c.656-1.155 1.451-2.554 2.257-3.028-4.161 2.431-7.425 5.537-9.164 9.638-.881 2.077-1.195 4.202-1.083 6.392.08 1.568.759 3.244.761 4.77.082-.619.214-1.231.328-1.845zm-1.795-20.112a22.884 22.884 0 01-.989 3.626c-.474 1.279-1.093 2.523-1.783 3.728-.43.751-1.979 2.327-1.978 3.157-.083-4.898 1.728-9.335 5.172-13.257-.378.657-.283 2.03-.422 2.746zm-.801 35.238c2.283-.034 4.821 2.521 6.513 4.225 2.411 2.428 5.132 4.551 7.199 7.306.017.025.035.049.054.073l-.054-.073c-.681-.957-.693-2.745-1.226-3.847-.728-1.504-1.827-2.909-3.065-4.133-2.316-2.29-5.765-4.068-9.421-3.551zm-.778 10.377c-.183-.062-1.782-.515-2.276-.347.586-.262 1.291-.568 1.926-.652 4.284-.569 9.492 3.141 10.067 6.721-.479-1.226-3.025-2.24-4.176-2.85-1.823-.966-3.565-2.137-5.541-2.872zm-2.276-.347l-.061.027c.009-.006.02-.011.031-.016l.019-.007.011-.004zm4.085 8.158c-1.185-.29-2.591-.49-3.784-.141-.471.138-1.443.424-1.56.392 2.819.659 5.462.985 8.391.914-.43.006-1.158-.339-1.834-.659-.467-.222-.91-.431-1.213-.506zm-11.214 13.85c-.138.008-.137.013 0 0zm0 0c4.26-.222 9.246.402 13.3 1.424a22.3 22.3 0 015.692 2.295c1.414.814 3.93 1.932 4.876 3.137-3.74-6.452-11.85-9.803-20.159-8.141-1.062.214-2.669 1.191-3.709 1.285zm1.748 12.515c3.232.418 6.546-.075 9.764-.44 1.381-.157 3.03-.86 4.389-.491-2.564-.883-5.638-1.3-8.409-1.173-2.922.135-5.895 1.064-8.583 2.029.675-.204 1.811-.058 2.839.075zm-13.401 10.396a73.946 73.946 0 00.098 6.742c.253 3.973 2.551 7.434 5.931 10.08 1.339 1.049 2.848 1.884 4.348 2.714 2.513 1.391 5.003 2.768 6.632 5.115 2.147 3.093 2.328 6.95.82 10.348-.249.56-.515 1.158-.522 1.584v-.049c.032-3.872.068-8.363-2.637-11.605-1.59-1.907-3.871-3.095-6.157-4.286-1.638-.853-3.279-1.707-4.671-2.829-3.278-2.642-5.765-6.094-6.325-9.985-.45-3.129-.232-8.576 2.985-10.73-.611.451-.486 2.357-.502 2.901zm.547-2.93a.43.43 0 00-.045.029l.045-.029zm-2.902 24.934l.07.077a.688.688 0 01-.07-.077zm11.144 12.843c-.199-5.108-3.703-8.958-7.936-11.333-.607-.341-2.603-.929-3.138-1.433 2.969 3.239 6.325 6.213 8.967 9.731.455.605 2.054 2.294 2.107 3.035zm.002.038l-.002-.038a.51.51 0 01.002.038zm41.016-101.763c1.204 1.051 2.011 2.357 2.674 3.709 1.531 3.119 1.816 6.717.589 10 .151-.523-.143-1.472-.374-2.219-.545-1.764-1.064-3.504-1.759-5.221-1.179-2.913-2.133-5.643-4.178-8.194.538.664 2.325 1.294 3.048 1.925zM179.147 48.805c.165 1.243-.241 2.644-.964 3.742.084-.197-.122-1.104-.288-1.837-.336-1.483-.138-2.97-.039-4.477.001.64 1.183 1.763 1.291 2.572zm-51.581 1.269c-.723 1.16-2 2.107-3.291 2.778.57-.336 1.104-1.993 1.538-2.55a16.958 16.958 0 012.578-2.63c-.205.22-.602 2.044-.825 2.402z" fill="#fff" fill-opacity=".6"/>\n')},isHat:!1,zIndex:0},dreads:{path:function(l){return '\n<path d="M242.135 168.863c4.834 6.791 11.097 14.001 12.243 22.053.455 3.198.708 16.236-7.542 11.431-.269 4.365-.967 4.985.34 9.206.886 2.859 2.08 8.615-3.864 8.095 2.257 6.175 5.881 14.765 2.483 21.16-5.588 10.517-11.893-2.733-13.571-7.485.102 3.279-3.425 9.19-7.838 4.63.348 5.413 2.513 13.778-.661 18.854-6.16 9.853-12.976-2.621-13.205-7.897-1.111 3.565-.275 12.137-7.592 10.151-6.325-1.716-4.039-10.09-2.816-13.87-2.011 3.557-4.482 8.853-4.871 12.869-.336 3.453 2.941 11.57-5.555 10.05-6.52-1.166-6.753-10.892-6.642-15.179.091-3.477 3.455-11.427 1.177-14.256-12.728 5.341.608 23.308-10.952 27.302-3.84 1.327-7.034-1.179-8.321-4.639.402-1.694-.357-2.562-2.276-2.605-1.216-1.478-2.015-1.434-2.801-3.651-2.313-6.521 2.191-15.19 5.429-21.005-3.352 3.057-6.053 7.256-9.69 9.916-2.461 1.799-6.086 2.311-8.385-.176-2.518-2.723-.139-5.334 1.219-7.817 3-5.485 7.727-8.68 12.668-13.082 4.319-3.848 8.169-8.179 12-12.367 2.557-2.794 5.001-5.799 7.051-8.973A72.089 72.089 0 00161 199h-4v-18.389a56.238 56.238 0 0025.804-24.981c.105-3.28.278-7.112.462-11.201.546-12.084 1.193-26.407.481-35.337l-.202-2.585c-1.114-14.358-1.787-23.023-11.991-36.058-4.562-5.828-13.185-7.674-21.724-9.502-8.085-1.73-16.095-3.445-20.512-8.508-4.124 4.78-10.142 7.32-16.735 8.99-1.454.368-2.909.667-4.341.962-4.986 1.025-9.692 1.992-13.079 5.602-7.802 8.314-11.237 13.88-13.626 24.255-2.648 11.5-3.341 22.898-2.536 34.578.13 1.88.224 3.782.32 5.692.352 7.095.712 14.322 2.89 21.104A56.225 56.225 0 00109 180.611V199h-4c-1.1 0-2.194.025-3.282.074.671 3.437 1.092 6.93.812 10.34-.41 4.99-1.345 9.653-.846 14.703 1.036 10.501 5.408 20.483 9.017 30.507 1.734 4.815 9.357 10.482 6.23 14.46-3.127 3.977-13.815-5.47-16.206-10.05-2.433-4.662-4.646-9.408-7.18-14.034 1.486 6.462 2.773 13.092 4.8 19.411 1.368 4.266 3.439 10.723-2.278 11.944-8.943 1.91-9.29-12.589-10.174-16.91-1.472-7.183-3.106-9.973-5.51-16.97-.478 5.344.352 10.912-.804 16.202-.697 3.19-4.356 5.829-6.555 8.534-7.532 9.275-9.325-6.284-11.235-10.551-3.305 2.401-10.5 7.16-14.908 4.139-3.255-2.231-1.187-6.273-.43-9.033 1.217-4.446 1.941-8.842-1.315-12.869-3.087 3.003-9.918 4.752-13.878 1.882-5.007-3.63-.615-8.936 1.629-12.702 4.329-7.261 4.07-15.869 5.442-23.941.46-2.701 1.064-6.259.298-8.121-1.1-2.672-2.299-2.698-4.735-2.09-3.449.862-6.29 2.79-6.873 5.578-.843 4.025 3.568 5.612 3.929 9.12.776 7.55-8.703 4.005-11.523.617-6.959-8.358-1.266-18.225 4.21-25.558 1.863-2.495 2.405-3.22 2.016-6.48-.766-6.416-2.503-12.183-1.879-18.727.856-8.962 4.306-17.434 9.351-24.818 3.454-5.053 5.284-9.449 5.783-15.563 1.418-17.389 7.32-35.281 15.058-50.748 3.968-7.93 7.96-16.487 14.828-22.391 2.23-1.917 6.24-2.8 8.165-4.654 3.567-3.434.44-9.494 4.953-13.389 3.781-3.264 8.173-2.183 12.275-3.945 4.218-1.811 5.116-7.42 10.217-8.61 5.163-1.203 9.289 2.182 13.661 3.804 6.425 2.383 10.446 1.688 16.755-.306l.082-.026c4.192-1.325 6.95-2.196 10.89.101 2.562 1.494 4.534 5.946 7.656 6.373 3.803.52 9.139-3.04 13.358-2.909 6.449.203 9.583 4.243 12.251 8.557 1.546 2.5 4.402 3.668 6.102 6.147.615.897 1.237 1.804 2.122 2.612 6.312 5.768 14.583 10.246 21.37 15.682 12.666 10.147 15.661 23.878 16.48 37.827.657 11.18-.365 24.312 6.743 34.313 3.71 5.219 7.82 9.733 10.018 15.852.785 2.186 1.865 5.194.523 7.111-1.809 2.584-6.359 2.61-8.316.142-1.897 5.874 4.572 14.355 8.038 19.226z" fill="'.concat(l,'"/>\n<path d="M182.502 156.207c-.077 2.994-.01 5.972.373 8.849.332 2.495.843 4.915 1.35 7.314 1.126 5.334 2.23 10.561 1.291 16.266-.745 4.532-2.725 8.876-5.352 12.942A72.102 72.102 0 00161 199h-4v-18.389a56.236 56.236 0 0025.502-24.404zm-80.784 42.867c-.361-1.852-.794-3.687-1.23-5.484-2.137-8.82-6.422-16.627-10.77-24.55-1.898-3.457-3.808-6.936-5.556-10.531a37.078 37.078 0 01-1.95-4.887A56.227 56.227 0 00109 180.611V199h-4c-1.1 0-2.194.025-3.282.074z" fill="#000" fill-opacity=".24"/>\n<path d="M102.48 33.51c-1.672 0-12.16 4.743-8.24 6.149 2.396.859 12.498-6.15 8.24-6.15zm68.568 13.847c-.846.38-.832.738.043 1.071.846-.38.832-.737-.043-1.071zm24.465 18.241l-.001-.001c-.58-1.252-1.087-2.345-1.372-2.753-.888-1.27-6.237-8.4-2.472-7.513 2.086.49 4.89 6.183 6.155 8.751l.001.002c.772 1.567 4.278 7.113.718 6.743-.634-.066-1.957-2.917-3.029-5.229zm8.51 45.147c-.154-1.164.249-4.751-2.458-3.41-1.809.897.661 11.717.816 13.122.146 1.318.3 2.636.455 3.953l.001.012v.002l.001.011c.608 6.077 1.418 12.108 1.33 18.231-.011.763-1.192 6.667 1.55 5.413 1.46-.667.777-8.745.568-11.218-.734-8.707-1.107-17.449-2.263-26.116zM65.361 122.248c.082 1.581-.703 9.748 1.43 9.799 1.825.044 1.24-8.401 1.004-11.83-.082-1.08-.08-11.139-2.106-9.908-2.308 1.402-.453 9.517-.328 11.939zm8.434 57.75c.011-1.428.821-14.445-1.904-11.376-1.363 1.535-.47 7.014-.34 8.873.049.707-.525 2.863.413 3.191.759.265 1.823.326 1.831-.688zm-25.674 13.164c1.93-.055.144-37.832-2.821-37.79-2.082.029 1.361 37.826 2.822 37.79zm2.232 19.354c-2.397 0-1.956 8.462-.544 9.139 2.14 1.025 3.226-9.139.544-9.139zm15.237 3.539c.021 1.058-1.178 1.074-1.979.744-.717-.297-.631-2.311-.58-3.487.047-1.109-.152-2.194-.314-3.289-.502-3.382-1.259-8.482.044-9.655 1.975-1.778 2.018.173 2.549 1.498 1.564 3.903.196 10.032.28 14.189zm137.433-46.468c-2.532-.501-3.857 8.094-2.702 9.016 1.917 1.53 5.349-8.49 2.702-9.016zm-.268 37.798c-1.138-.226-9.433 15.733-8.75 16.635 1.299 1.719 12.829-15.82 8.75-16.635zm-20.422 7.374c-1.781-.803-9.334 10.751-7.406 11.619 1.748.786 9.562-10.652 7.406-11.619zm42.093-43.312c-2.151 0-2.056 11.822-.4 12.568 1.711.771 2.942-12.568.4-12.568zM83.512 54.191c1.261-.643 5.444-.859 3.107 1.295-2.005 1.844-9.543 12.519-12.126 12.626-4.226.175 2.586-7.24 4.76-9.606 1.327-1.445 2.485-3.409 4.26-4.315zM59.254 83.98c-2.182-.428-5.835 10.266-4.56 11.556 1.923 1.95 7.007-11.07 4.56-11.555zm22.147 117.87c.478-2.608 2.375-.201 2.792 1.142.413 1.341 4.632 11.08 3.571 12.361-1.633 1.972-2.34-1.375-2.898-2.573-1.318-2.834-3.922-8.433-3.465-10.93zm-5.414 23.966c-2.295 0-2.03 9.802-.664 10.385 2.117.902 3.479-10.385.664-10.385zm156.823-21.94c2.237 4.407 3.913 8.871 4.981 13.571.137.603 2.055 5.562-.662 4.844-1.562-.413-1.803-4.785-2.202-6.11-.519-1.724-1.539-3.624-2.573-5.547-1.416-2.636-2.855-5.316-3.059-7.647-.34-3.897 1.841-2.412 3.515.889zm-14.721 13.075c-2.131-.01-2.235 10.773-.901 11.402 1.863.878 3.621-11.402.901-11.402zm6.161-88.297c1.582-.412-3.41-13.325-5.178-13.183-2.694.218 2.776 13.803 5.178 13.183zm-26.816 56.093c-.846.381-.832.738.043 1.072.846-.381.832-.739-.043-1.072zm-24.217 55.241c.793 0 1.121-1.224-.052-1.252-.775.007-1.184 1.252.052 1.252zm-98.532-55.359c.03-1.909-2.47-.509-2.454 1.101.033 3.214 2.401 1.746 2.454-1.101zm-6.165-47.746c-.805 0-1.134 1.237.05 1.266.784-.006 1.198-1.266-.05-1.266zm-20.743 62.556c-.09-.003 1.532-1.987 1.61-.046.06 1.463-1.322.053-1.61.046zM53.6 98.063c-2.368 0-2.024 5.754-.513 6.123 2.52.616 2.864-6.123.513-6.123zm12.613 124.263c-2.285 0-2.44 7.814-.862 8.3 2.45.754 3.243-8.3.862-8.3zm-18.756 5.606c-.872.391-.858.76.042 1.104.873-.392.858-.759-.042-1.104zm169.999 3.351c-2.32 0-2.229 9.553-.805 10.199 1.99.902 3.488-10.199.805-10.199zm-23.51 8.879c-2.411-.482-3.673 7.405-2.55 8.29 1.853 1.459 5.026-7.796 2.55-8.29zm-20.481 7.289c-1.997 0-1.506 3.575-.354 4.107 1.994.92 2.584-4.107.354-4.107z" fill="#fff" fill-opacity=".3"/>\n')},isHat:!1,zIndex:0},frida:{path:function(l){return '\n<path d="M77 98.166v-.23l.083.064c1.69-27.447 17.839-33.192 32.509-38.41 10.529-3.746 20.296-7.22 23.408-18.254 3.112 11.034 12.879 14.508 23.408 18.254 14.67 5.218 30.819 10.963 32.509 38.41l.083-.064v.23a12.008 12.008 0 019.893 10.227A16.433 16.433 0 00203 97.5c0-2.13-.404-4.166-1.138-6.035A16.453 16.453 0 00207 79.5c0-5.836-3.03-10.964-7.602-13.898A16.44 16.44 0 00201 58.5c0-7.635-5.185-14.059-12.227-15.941.15-.998.227-2.02.227-3.059 0-11.322-9.178-20.5-20.5-20.5-2.629 0-5.143.495-7.453 1.397C157.317 15.306 151.295 12 144.5 12c-4.262 0-8.221 1.3-11.5 3.527A20.405 20.405 0 00121.5 12c-6.795 0-12.817 3.306-16.547 8.397A20.452 20.452 0 0097.5 19C86.178 19 77 28.178 77 39.5c0 1.04.077 2.06.227 3.059C70.186 44.442 65 50.865 65 58.5c0 2.192.427 4.284 1.203 6.197C60.75 67.39 57 73.007 57 79.5c0 5.438 2.63 10.261 6.689 13.267A16.504 16.504 0 0063 97.5c0 4.175 1.55 7.987 4.107 10.893A12.009 12.009 0 0177 98.166zm.209 36.701a12.01 12.01 0 01-8.86-6.334A16.43 16.43 0 0065 138.5c0 7.389 4.858 13.644 11.554 15.746A16.523 16.523 0 0076 158.5c0 8.713 6.754 15.849 15.312 16.458C93.825 180.861 99.679 185 106.5 185c.85 0 1.685-.064 2.5-.188v-4.201c-17.53-8.328-30.048-25.496-31.791-45.744zM157 180.611v4.201c.815.124 1.65.188 2.5.188 6.821 0 12.675-4.139 15.188-10.042 8.558-.609 15.312-7.745 15.312-16.458 0-1.471-.192-2.897-.554-4.254C196.142 152.144 201 145.889 201 138.5c0-3.744-1.247-7.198-3.349-9.967a12.012 12.012 0 01-8.86 6.334c-1.743 20.248-14.26 37.416-31.791 45.744z" fill="'.concat(l,'"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M170.125 28.357a7.381 7.381 0 00-1.14.454c-.164-.507-.37-1-.61-1.478 3.712-3.638 5.24-9.539 5.24-9.539s-1.153.204-3.098.634c-.264.038-3.78.6-8.233 2.314a29.96 29.96 0 00-2.099-1.38c.514-2.934 1.673-12.561-4.468-16.116-6.105-3.534-13.793 2.204-16.115 4.148a24.905 24.905 0 00-.704-.423c-3.066-1.775-10.768-5.351-16.048-.235-5.645 5.468-2.312 14.003-1.045 16.698-.163.152-.35.33-.555.534a4.466 4.466 0 00-.108-.11c-2.166-2.166-5.255-2.75-8.062-1.522l-2.133.933-1.38-1.875c-1.923-2.608-5.24-3.612-8.283-2.546-2.692.943-4.49 3.207-4.809 6.054l-.26 2.313-2.313.26c-2.847.319-5.11 2.117-6.054 4.81-.789 2.25-.462 4.65.832 6.525a5.18 5.18 0 00-1.493-.192c-.373.007-.794.099-1.242.25.269-.39.473-.768.582-1.124a5.207 5.207 0 00-3.452-6.494 5.169 5.169 0 00-3.962.382 5.164 5.164 0 00-2.532 3.07c-.11.36-.149.793-.143 1.268-.288-.378-.586-.696-.893-.91a5.206 5.206 0 00-7.242 1.276 5.206 5.206 0 001.277 7.243c.307.214.707.386 1.16.527-.447.157-.842.342-1.141.568a5.166 5.166 0 00-2.02 3.429 5.168 5.168 0 00.997 3.853 5.163 5.163 0 003.43 2.02 5.167 5.167 0 003.853-.997c.298-.224.584-.546.857-.932.012.473.07.9.19 1.252a5.206 5.206 0 006.61 3.225 5.172 5.172 0 002.561-1.93 5.196 5.196 0 00.663-4.68c-.122-.352-.339-.724-.62-1.103.452.135.876.212 1.248.206a5.176 5.176 0 003.365-1.317c.152 1.634.875 3.191 2.125 4.442 2.166 2.166 5.255 2.749 8.062 1.523l2.134-.934 1.38 1.875c.285.387.6.74.941 1.054a18.67 18.67 0 01-1.642 1.444 14.59 14.59 0 00-1.922-1.06c-2.603-1.227-6.829-2.194-11.419.456-.66.381-1.27.842-1.834 1.357C84.615 61.459 83 67.696 83 67.696s7.374 4.172 15.258.428c5.904-2.803 6.536-7.224 6.481-9.268a28.568 28.568 0 002.265-2.062 7.273 7.273 0 005.713.359c2.693-.945 4.49-3.208 4.809-6.055l.258-2.314 2.314-.26c2.253-.252 4.14-1.43 5.297-3.245 2.579.323 4.97.135 6.197-.01.993 1.88 3.83 6.712 7.888 9.061 1.67.967 3.375 1.413 5.071 1.325 6.905-.358 9.916-9.995 10.669-12.912a28.097 28.097 0 002.71-.517 7.358 7.358 0 00-1.185 3.886 7.368 7.368 0 001.334 4.363 7.396 7.396 0 005.936 3.164c.53.01 1.133-.1 1.777-.293-.401.54-.71 1.069-.883 1.57a7.395 7.395 0 00.943 6.66 7.36 7.36 0 003.645 2.746c3.569 1.229 7.446-.44 9.059-3.751.107.204.223.412.346.623-.716 1.471-3.806 8.955 5.533 12.354 6.765 2.462 13.449-1.147 13.492-1.17 0 0-2.065-9.478-9.458-12.551a7.377 7.377 0 002.289-2.005 7.355 7.355 0 001.418-5.483 7.35 7.35 0 00-2.874-4.88c-.425-.321-.987-.584-1.625-.808.645-.201 1.216-.445 1.652-.75 3.342-2.34 4.158-6.964 1.817-10.307-2.34-3.342-6.964-4.157-10.306-1.817-.436.306-.86.758-1.27 1.296.008-.676-.048-1.293-.204-1.803a7.35 7.35 0 00-3.603-4.37 7.355 7.355 0 00-5.638-.543zm-4.085 10.84a8.196 8.196 0 00-.731-.213c.134-.1.267-.203.397-.309.101.172.213.346.334.521zm14.353 20.081c.154.117.312.227.474.33a6.97 6.97 0 00-.925.522 13.626 13.626 0 01-.797-1.65 8.08 8.08 0 00.028-.528c.389.549.797 1.007 1.22 1.326zm-88.2-17.159a5.134 5.134 0 00-.123-.32l.199.147-.076.173z" fill="#000" fill-opacity=".2"/>\n<path d="M179.032 58.94s-4.981 8.828 5.403 12.608c6.787 2.47 13.492-1.17 13.492-1.17s-2.159-9.908-9.963-12.748c-6.108-2.224-8.932 1.31-8.932 1.31z" fill="#5DD362"/>\n<path d="M197.926 70.377s-2.158-9.907-9.963-12.747c-4.072-1.483-6.7-.387-8.022.5-1.357-2.394-1.474-4.185-1.449-4.252.03-.293-.193-.526-.465-.625-.067-.025-.203-.074-.295-.032-.389.011-.671.365-.657.75-.006.226.347 4.535 4.626 8.828 6.048 6.61 16.225 7.578 16.225 7.578z" fill="#42BC53"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M166.222 26.99c5.283-3.05 7.393-11.196 7.393-11.196s-7.374-4.172-15.259-.428c-7.884 3.744-6.366 10.373-6.366 10.373s6.611 5.651 14.232 1.252z" fill="#5DD362"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M148 29.428c.05.087.1.174.237.21.423.333 1.092.293 1.425-.13 1.05-1.183 2.062-2.23 3.261-3.153 1.966 1.405 7.324 4.085 13.299.636 5.283-3.05 7.393-11.197 7.393-11.197s-1.153.204-3.098.634c-.533.077-14.378 2.297-22.361 11.87a.961.961 0 00-.156 1.13z" fill="#42BC53"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M90.392 54.5C85.11 57.55 83 65.696 83 65.696s7.374 4.172 15.258.428c7.885-3.743 6.367-10.373 6.367-10.373S98.013 50.1 90.392 54.5z" fill="#5DD362"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M108.615 52.062c-.05-.087-.1-.173-.237-.21-.423-.333-1.093-.292-1.426.13-1.049 1.184-2.061 2.23-3.26 3.153-1.966-1.405-7.324-4.085-13.3-.635C85.11 57.55 83 65.696 83 65.696s1.153-.203 3.098-.634c.533-.077 14.378-2.297 22.36-11.87a.96.96 0 00.157-1.13z" fill="#42BC53"/>\n<path d="M68.575 49.956a5.168 5.168 0 01-.996-3.853 5.165 5.165 0 012.02-3.43c.298-.225.693-.41 1.141-.567-.453-.141-.854-.313-1.16-.527a5.206 5.206 0 01-1.278-7.243 5.206 5.206 0 017.242-1.276c.307.214.605.532.893.91-.005-.475.034-.909.144-1.267a5.164 5.164 0 012.531-3.07 5.169 5.169 0 013.962-.383 5.207 5.207 0 013.453 6.494c-.11.356-.314.735-.583 1.124.448-.151.87-.243 1.242-.25a5.206 5.206 0 015.29 5.11 5.177 5.177 0 01-.937 3.066 5.198 5.198 0 01-4.171 2.223c-.373.006-.797-.071-1.25-.206.282.38.5.75.621 1.103a5.196 5.196 0 01-.662 4.68 5.171 5.171 0 01-2.561 1.93 5.206 5.206 0 01-6.61-3.225c-.121-.352-.179-.779-.19-1.252-.274.386-.56.708-.857.932a5.166 5.166 0 01-3.854.997 5.163 5.163 0 01-3.43-2.02z" fill="#4ACAD3"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M81.822 37.64a1.444 1.444 0 10-2.763-.845c-.233.763.232 4.182.232 4.182s2.297-2.574 2.53-3.337zm2.242 5.797a1.444 1.444 0 10-.05-2.888c-.798.014-3.906 1.513-3.906 1.513s3.159 1.39 3.956 1.375zm-6.057-2.018s-1.738-2.98-2.392-3.438a1.444 1.444 0 10-1.657 2.366c.654.458 4.049 1.072 4.049 1.072zm3.073 6.838a1.444 1.444 0 00.895-1.836c-.26-.755-2.646-3.246-2.646-3.246s-.345 3.433-.086 4.187a1.445 1.445 0 001.837.895zm-5.32-1.96c.637-.48 2.27-3.52 2.27-3.52s-3.371.732-4.008 1.212a1.444 1.444 0 101.738 2.307z" fill="#fff"/>\n<path d="M117.526 49.098l.258-2.314 2.314-.26c2.847-.319 5.11-2.116 6.054-4.81 1.066-3.042.065-6.359-2.547-8.281l-1.874-1.38.932-2.134c1.228-2.806.645-5.896-1.521-8.061-2.166-2.166-5.255-2.75-8.062-1.522l-2.133.933-1.38-1.875c-1.923-2.608-5.24-3.612-8.283-2.546-2.692.943-4.49 3.207-4.81 6.054l-.258 2.313-2.314.26c-2.847.319-5.11 2.117-6.054 4.81-.938 2.676-.299 5.56 1.668 7.528a7.7 7.7 0 00.878.753l1.874 1.38-.933 2.134c-1.226 2.807-.643 5.896 1.523 8.062 2.166 2.166 5.255 2.749 8.062 1.523l2.134-.934 1.38 1.875c1.917 2.61 5.24 3.612 8.283 2.547 2.692-.945 4.49-3.208 4.809-6.055z" fill="#FDB599"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M109.881 41.19a1.44 1.44 0 11-2.782.746C106.894 41.17 107 36 107 36s-2.493 4.529-3.055 5.091a1.441 1.441 0 01-2.037-2.036C102.471 38.492 107 36 107 36s-5.169.106-5.937-.1a1.44 1.44 0 01.746-2.782C102.577 33.325 107 36 107 36s-2.676-4.422-2.882-5.19a1.44 1.44 0 112.782-.746c.206.768.1 5.936.1 5.936s2.492-4.529 3.054-5.091a1.44 1.44 0 012.037 2.036C111.528 33.508 107 36 107 36s5.168-.106 5.936.1a1.44 1.44 0 11-.746 2.782C111.422 38.676 107 36 107 36s2.675 4.422 2.881 5.19z" fill="#fff"/>\n<path d="M190.758 55.822a7.359 7.359 0 001.418-5.483 7.354 7.354 0 00-2.874-4.88c-.426-.321-.987-.584-1.625-.808.645-.201 1.216-.445 1.652-.75 3.342-2.34 4.158-6.964 1.817-10.307-2.34-3.342-6.964-4.157-10.306-1.817-.436.306-.86.758-1.271 1.296.009-.676-.047-1.293-.203-1.803a7.35 7.35 0 00-3.603-4.37 7.355 7.355 0 00-5.638-.543c-3.902 1.193-6.106 5.338-4.914 9.24.156.507.447 1.046.829 1.6-.637-.216-1.236-.346-1.767-.355-4.08-.071-7.456 3.19-7.528 7.27a7.368 7.368 0 001.334 4.363 7.396 7.396 0 005.936 3.164c.53.01 1.133-.1 1.777-.293-.401.54-.71 1.069-.883 1.57a7.395 7.395 0 00.943 6.66 7.357 7.357 0 003.645 2.746c3.858 1.329 8.077-.73 9.405-4.588.173-.502.255-1.109.271-1.782.389.549.797 1.007 1.22 1.326a7.351 7.351 0 005.483 1.418 7.348 7.348 0 004.882-2.874z" fill="#F7D30C"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M171.908 38.295a2.054 2.054 0 113.931-1.202c.331 1.086-.33 5.95-.33 5.95s-3.27-3.662-3.601-4.748zm-3.192 8.25a2.055 2.055 0 11.072-4.11c1.135.02 5.557 2.153 5.557 2.153s-4.494 1.977-5.629 1.957zm8.62-2.872s2.474-4.241 3.404-4.892a2.055 2.055 0 112.358 3.367c-.93.651-5.762 1.525-5.762 1.525zm-4.373 9.731a2.056 2.056 0 01-1.274-2.613c.369-1.073 3.765-4.62 3.765-4.62s.492 4.886.123 5.96a2.057 2.057 0 01-2.614 1.273zm7.57-2.79c-.907-.683-3.23-5.008-3.23-5.008s4.797 1.042 5.704 1.725a2.055 2.055 0 11-2.474 3.283z" fill="#fff"/>\n<path d="M169.138 31.546c1.825-6.983-5.994-12.414-8.953-14.184.514-2.934 1.673-12.561-4.468-16.116-6.105-3.534-13.793 2.204-16.116 4.148a23.39 23.39 0 00-.703-.423c-3.066-1.775-10.768-5.351-16.048-.235-5.645 5.468-2.313 14.003-1.045 16.698-2.159 2.011-8.384 8.592-5.818 15.59.706 1.93 2.011 3.456 3.882 4.538 4.031 2.334 9.607 1.958 11.723 1.707.993 1.88 3.83 6.712 7.888 9.061 1.67.967 3.375 1.413 5.07 1.325 6.905-.358 9.917-9.995 10.67-12.912 2.861-.396 12.086-2.199 13.918-9.197z" fill="#FF7398"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M142.764 25.603s3.685 8.188.353 8.71c-3.334.521-1.46-8.591-1.46-8.591s-7.111 6.007-8.15 3.028c-1.039-2.979 7.701-4.047 7.701-4.047s-7.987-4.693-5.393-6.837c2.594-2.144 6.216 6.092 6.216 6.092s1.944-8.92 4.82-7.254c2.876 1.665-3.857 7.811-3.857 7.811s8.877-.99 8.369 2.352c-.505 3.342-8.599-1.264-8.599-1.264z" fill="#fff"/>\n<rect x="191" y="129" width="2" height="39" rx="1" fill="#E6E6E6"/>\n<path d="M202 166h-9.43l6.43-17h-11l-6 21h8.636L186 189l16-23z" fill="#9177FF"/>\n')},isHat:!1,zIndex:0},froAndBand:{path:function(l){return '\n<path d="M250 70.5c0 .8-.033 1.59-.097 2.374C256.882 82.449 261 94.244 261 107a57.867 57.867 0 01-3.667 20.341A28.6 28.6 0 01258 133.5c0 9.788-4.934 18.424-12.451 23.555C236.837 174.792 218.594 187 197.5 187a54.12 54.12 0 01-5.81-.312A36.355 36.355 0 01168.5 195c-4.018 0-7.884-.649-11.5-1.849v-12.54c17.531-8.328 30.048-25.496 31.791-45.744C194.569 134.002 199 129.019 199 123v-13c0-5.946-4.325-10.882-10-11.834V92c0-5.441-.776-10.702-2.224-15.676l1.377 12.87-11.34-24-45.136-19.523-30.114 10.557L80.065 76.42l-.045-2.609A55.927 55.927 0 0077 92v6.166c-5.675.952-10 5.888-10 11.834v13c0 6.019 4.43 11.002 10.209 11.867 1.743 20.248 14.26 37.416 31.791 45.744v10.944A36.36 36.36 0 0193.5 195a36.352 36.352 0 01-23.19-8.312 54.13 54.13 0 01-5.81.312c-21.094 0-39.337-12.208-48.049-29.945C8.934 151.924 4 143.288 4 133.5c0-2.115.23-4.175.667-6.159A57.872 57.872 0 011 107c0-12.756 4.118-24.55 11.097-34.126A28.892 28.892 0 0112 70.5c0-11.297 6.573-21.06 16.104-25.67 8.433-18.128 26.454-30.894 47.546-31.78A28.406 28.406 0 0195.5 5c2.327 0 4.589.279 6.754.805C111.776 2.058 122.148 0 133 0c10.346 0 20.255 1.87 29.408 5.292A28.728 28.728 0 01166.5 5a28.407 28.407 0 0119.85 8.05c21.092.886 39.113 13.652 47.546 31.78C243.427 49.44 250 59.203 250 70.5z" fill="'.concat(l,'"/>\n<path d="M188.369 98.975a48.7 48.7 0 00.631-7.823C189 62.35 163.704 39 132.5 39S76 62.35 76 91.152c0 2.659.216 5.271.631 7.823 4.09-25.092 27.545-44.33 55.869-44.33 28.324 0 51.78 19.238 55.869 44.33z" fill="#92D9FF"/>\n')},isHat:!1,zIndex:0},fro:{path:function(l){return '\n<path d="M94.703 69.386c-4.624 24.473-16.011 42.725-25.742 41.009a7.485 7.485 0 01-1.961-.637V89c0-22.474 11.233-42.324 28.39-54.243.486 2.389.841 4.993 1.056 7.77 10.694-1.546 23.348-2.44 36.908-2.44 13.269 0 25.67.856 36.217 2.341.215-2.738.566-5.306 1.046-7.666C187.771 46.682 199 66.53 199 89v20.762a7.463 7.463 0 01-1.953.633c-9.716 1.713-21.085-16.484-25.722-40.905-10.915 1.642-23.959 2.597-37.971 2.597-14.305 0-27.6-.995-38.651-2.7z" fill="#000" fill-opacity=".16"/>\n<path d="M133 0c-11.211 0-21.91 2.196-31.688 6.182A21.712 21.712 0 0098.5 6c-6.701 0-12.774 3.075-17.197 8.057-18.044.934-33.463 13.312-40.774 30.9C32.507 49.557 27 59.043 27 70c0 .58.015 1.154.046 1.725C20.739 81.265 17 93.135 17 106c0 7.331 1.214 14.339 3.425 20.777A32.064 32.064 0 0020 132c0 9.454 4.1 17.814 10.378 22.884C37.74 172.684 53.61 185 72 185c1.498 0 2.98-.082 4.441-.242C81.889 189.907 88.879 193 96.5 193c4.441 0 8.668-1.05 12.5-2.946v-9.443c-17.53-8.328-30.048-25.496-31.791-45.744C71.43 134.002 67 129.019 67 123v-13c0-1.721.362-3.358 1.015-4.838.31.099.625.176.946.233 9.73 1.716 21.118-16.536 25.742-41.009 11.051 1.706 24.346 2.7 38.651 2.7 14.012 0 27.056-.954 37.971-2.596 4.637 24.42 16.006 42.618 25.722 40.905.319-.056.632-.133.939-.23A11.958 11.958 0 01199 110v13c0 6.019-4.431 11.002-10.209 11.867-1.743 20.248-14.26 37.416-31.791 45.744v9.443c3.832 1.896 8.059 2.946 12.5 2.946 7.621 0 14.611-3.093 20.059-8.242 1.461.16 2.943.242 4.441.242 18.39 0 34.26-12.316 41.622-30.116C241.9 149.814 246 141.454 246 132c0-1.785-.146-3.531-.426-5.223C247.786 120.339 249 113.331 249 106c0-12.865-3.739-24.736-10.046-34.275.031-.57.046-1.146.046-1.725 0-10.957-5.507-20.443-13.529-25.043-7.311-17.588-22.73-29.966-40.774-30.9C180.274 9.075 174.201 6 167.5 6c-.951 0-1.889.062-2.812.182C154.91 2.196 144.211 0 133 0z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:0},longButNotTooLong:{path:function(l){return '\n<path d="M50 90.5c0 4.55 1.695 8.643 4.853 10.773.905.61 2.47.925 4.147 1.067V182a8 8 0 008 8h42v-9.389c-17.53-8.328-30.048-25.496-31.791-45.744C71.43 134.002 67 129.019 67 123v-13c0-3.491 1.49-6.633 3.87-8.826 11.539-2.619 24.1-7.536 36.472-14.679 12.131-7.004 22.502-15.237 30.479-23.743-3.427 7.908-7.576 14.836-12.449 20.783 12.675-5.523 21.306-14.403 25.892-26.639.377.922.771 1.843 1.18 2.762 10.256 23.035 27.874 39.36 45.762 44.745.513 2.11.794 4.081.794 5.597v13c0 6.019-4.431 11.002-10.209 11.867-1.743 20.248-14.26 37.416-31.791 45.744V190h18c17.673 0 32-14.327 32-32v-54.125c0-.07-.01-.162-.031-.274-.073-5.64-.279-18.873-.609-21.375C201.577 45.976 170.556 18 133 18c-36.085 0-66.137 25.828-73 60-5.523 0-10 5.596-10 12.5z" fill="'.concat(l,'"/>\n<path d="M152.444 59.658c11.938 26.813 33.852 44.536 54.556 46.493V92c0-40.87-33.131-74-74-74-36.085 0-66.137 25.828-72.679 60.006A8.168 8.168 0 0060 78c-5.523 0-10 5.596-10 12.5 0 6.482 3.947 11.811 9 12.438v.155c.316-.029.634-.06.953-.093H60c.65 0 1.284-.077 1.899-.225 13.812-1.76 29.78-7.237 45.443-16.28 12.131-7.004 22.502-15.237 30.479-23.743-3.427 7.908-7.576 14.836-12.449 20.783 12.675-5.523 21.306-14.403 25.892-26.639.377.922.771 1.843 1.18 2.762z" fill="#fff" fill-opacity=".08"/>\n')},isHat:!1,zIndex:0},miaWallace:{path:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M69.033 76.213c12.938-33.084 26.613-49.626 41.025-49.626.539 0 29.253-.238 48.055-.36C178.767 35.585 193 55.304 193 78.115V93h-82.942l-2.805-23.18L103.374 93H69V78.115c0-.637.011-1.27.033-1.902z" fill="#000" fill-opacity=".16"/>\n<path d="M40 145c-.085-18.985 30.32-97.205 41-110 7.923-9.491 27.695-15.45 52-15 24.305.45 44.862 3.812 53 14 12.324 15.428 40.085 92.015 40 111-.099 21.266-9.622 33.59-18.609 45.221-1.494 1.933-2.972 3.847-4.391 5.779-10.279-2.665-27.854-5.184-46-6.682v-8.707c18.92-8.988 32-28.272 32-50.611V92a56.96 56.96 0 00-.14-4h-76.802l-2.805-21.444L105.374 88H77.141a56.837 56.837 0 00-.14 4v38c0 22.339 13.08 41.623 31.999 50.611v8.707c-18.145 1.498-35.72 4.017-46 6.682-1.418-1.932-2.896-3.845-4.39-5.777v-.002C49.623 178.591 40.1 166.266 40 145z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:0},shavedSides:{path:function(l){return '\n<path d="M175.831 55.922l-.03.018c.757.878 1.486 1.78 2.186 2.706C184.907 67.963 189 79.502 189 92v5.5c0-15.772-6.7-29.98-17.409-39.931-11.584 3.77-49.581 14.274-77.63.42C83.513 67.92 77 81.95 77 97.5V92a55.75 55.75 0 0111.013-33.354c.71-.94 1.45-1.855 2.22-2.746a5.163 5.163 0 01-.028-.022C100.478 43.721 115.838 36 133 36c17.183 0 32.559 7.74 42.831 19.922z" fill="#000" fill-opacity=".16"/>\n<path d="M92.537 53.286C82.913 63.342 77 76.98 77 92v6.166a11.968 11.968 0 00-6.485 3.349l.702-17.372c.56-13.884 7.234-26.125 17.363-34.173-2.207-3.843-1.455-10.333 7.802-13.093 5.065-1.51 7.572-5.087 10.234-8.884 3.503-4.995 7.272-10.371 17.487-11.92 9.866-1.494 13.227-.88 17.043-.184 3.138.572 6.584 1.201 14.205.762 9.852-.57 16.862-3.993 21.424-6.221 3.262-1.593 5.272-2.575 6.176-1.467 15.42 18.903 6.968 33.79-6.198 41.953C186.692 59.354 193 71.94 193 86v13.605a11.921 11.921 0 00-4-1.44V92c0-15.256-6.101-29.087-15.995-39.187-7.77 2.744-50.391 16.543-80.468.473zM223.61 226.052c3.059 5.601 4.049 11.122 3.499 16.377C216.051 216.878 190.613 199 161 199h-4v-18.389c17.531-8.328 30.048-25.496 31.791-45.744a11.918 11.918 0 004.209-1.472v20.714c0 20.759 11.475 39.779 22.146 57.465 2.972 4.926 5.882 9.749 8.464 14.478zM68.697 146.504l.661-16.359a11.993 11.993 0 007.85 4.722c1.744 20.248 14.261 37.416 31.792 45.744V199h-4c-11.197 0-21.798 2.556-31.25 7.116-2.986-18.284-4.297-38.673-5.053-59.612z" fill="'.concat(l,'"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M90.878 52.361c33.225 19.3 83.367 0 83.367 0 14.53-7.772 25.086-23.319 8.706-43.398-2.168-2.658-10.706 6.713-27.6 7.688-16.893.974-13.271-3.301-31.248-.577s-15.991 17.304-27.721 20.803c-11.73 3.498-9.804 12.986-5.504 15.484z" fill="#fff" fill-opacity=".2"/>\n')},isHat:!1,zIndex:0},straightAndStrand:{path:function(l){return '\n<path d="M133 18c-40.87 0-74 33.13-74 74v96a73.889 73.889 0 004.125 24.423C74.924 203.973 89.381 199 105 199h4v-18.389c-17.53-8.328-30.048-25.496-31.791-45.744C71.43 134.002 67 129.019 67 123v-13c0-1.147.16-2.256.461-3.306 17.13-6.012 33.746-21.936 43.585-44.036.41-.92.803-1.84 1.181-2.762 4.586 12.236 13.216 21.116 25.891 26.639-4.872-5.947-9.022-12.875-12.448-20.783 7.976 8.506 18.347 16.74 30.479 23.743 14.33 8.274 28.916 13.562 41.872 15.75A11.96 11.96 0 01199 110v13c0 6.019-4.431 11.002-10.209 11.867-1.743 20.248-14.26 37.416-31.791 45.744V199h4c15.619 0 30.076 4.973 41.875 13.423A73.896 73.896 0 00207 188V92c0-40.87-33.131-74-74-74z" fill="'.concat(l,'"/>\n<path d="M111.046 62.658C99.59 88.39 78.946 105.75 59 108.838v4c19.945-3.088 40.59-20.448 52.046-46.18.41-.92.803-1.84 1.181-2.762 4.586 12.236 13.216 21.116 25.891 26.639a78.162 78.162 0 01-4.622-6.26c-10.175-5.567-17.264-13.693-21.269-24.379a98.804 98.804 0 01-1.181 2.762zm18.457 10.982c7.363 7.112 16.373 13.924 26.646 19.855 17.752 10.25 35.898 15.918 50.851 16.786v-4c-14.953-.868-33.099-6.536-50.851-16.786-12.132-7.004-22.503-15.237-30.479-23.743a98.293 98.293 0 003.833 7.888z" fill="#000" fill-opacity=".16"/>\n')},isHat:!1,zIndex:0},straight01:{path:function(l){return '\n<path d="M67 113c10.859-22.702 34.67-31.597 55.44-39.355 13.32-4.976 25.389-9.485 31.99-16.868 2.233 2.027 4.762 4.058 7.424 6.194C172.063 71.166 184.212 80.917 189 98v.165a12.01 12.01 0 019.815 9.726v-21.85a46.41 46.41 0 00-.158-3.838C203.2 65.198 195.565 44.415 186 35c-9.481-8.818-22.302-12.319-30.953-8.478C143.442 8.982 109.905 13.241 90 28c-13.22 9.808-24.787 25.721-27.845 45.751A46.18 46.18 0 0061 84.046v88.495c-.192 31.515-7.394 82.497-21 90.459 62.358 16.798 71.93-38.145 69-82v-.389c-17.53-8.328-30.048-25.496-31.791-45.744C71.43 134.003 67 129.019 67 123v-10zm90 67.611c17.531-8.328 30.048-25.496 31.791-45.744a12.007 12.007 0 0010.024-9.759v1.363c0 15.828 3.758 31.43 10.963 45.523l26.949 52.707c7.225 14.132 4.676 29.741-3.937 40.761C229.962 228.285 198.901 199 161 199h-4v-18.389z" fill="'.concat(l,'"/>\n<path d="M67 112.999c10.86-22.7 34.67-31.595 55.44-39.354 13.319-4.976 25.389-9.484 31.989-16.868 2.234 2.027 4.763 4.058 7.425 6.194 10.184 8.175 22.297 17.898 27.11 34.902-4.577-14.03-15.759-21.215-25.604-27.54-3.211-2.064-6.28-4.036-8.931-6.124-6.601 6.407-18.67 10.32-31.989 14.638C101.67 85.58 77.86 93.299 67 112.999z" fill="#000" fill-opacity=".16"/>\n')},isHat:!1,zIndex:0},straight02:{path:function(l){return '\n<path d="M157 180.611V199h4c17.491 0 33.525 6.237 46 16.608V92c0-40.87-33.131-74-74-74-40.87 0-74 33.13-74 74v183.716c13.57-1.94 24-13.61 24-27.716v-45.577A71.952 71.952 0 01105 199h4v-18.389a56.236 56.236 0 01-26-25.365v-61.98c9.147-2.975 18.778-7.249 28.342-12.77 15.403-8.894 28.089-19.555 36.724-30.099a86.935 86.935 0 007.044 15.488c8.768 15.185 21.114 26.349 33.89 32.032v.249c.4.067.794.154 1.18.26.774.323 1.55.626 2.326.91A11.998 11.998 0 01199 110v13c0 6.019-4.431 11.002-10.209 11.867-1.743 20.248-14.26 37.416-31.791 45.744z" fill="'.concat(l,'"/>\n<path d="M157 199v-18.389c17.531-8.328 30.048-25.496 31.791-45.744C194.569 134.002 199 129.019 199 123v-13c0-4.643-2.636-8.669-6.494-10.665 4.869 1.773 9.757 2.737 14.494 2.813v113.46C194.525 205.237 178.491 199 161 199h-4zm-74 3.423v-47.177a56.236 56.236 0 0026 25.365V199h-4c-7.673 0-15.065 1.2-22 3.423zM189 97.917v.249c.4.067.794.154 1.18.26a55.343 55.343 0 01-1.18-.509z" fill="#000" fill-opacity=".27"/>\n')},isHat:!1,zIndex:0},dreads01:{path:function(l){return '\n<path d="M187.709 56.124c.892 3.247 2.163 11.95-.072 14.833-.746.962-5.841-1.74-7.966-2.913-1.243-.687-2.415-1.34-3.532-1.963-14.915-8.316-19.735-11.004-45.893-10.623-28.116.409-47.379 13.582-48.462 14.93-.754.937-1.716 3.44-2.508 10.412-.25 2.208-.32 4.97-.39 7.713-.15 5.922-.298 11.76-2.255 11.75-2.44-.013-2.97-23.786-1.917-33.217.04-.352.106-.773.178-1.226.223-1.407.496-3.129.155-4.114-.153-.444-.54-.714-.937-.991-.62-.434-1.265-.884-1.077-2.04.212-1.305 1.092-1.429 1.964-1.551.569-.08 1.135-.16 1.509-.567 1.128-1.228.453-1.867-.318-2.597-.455-.431-.944-.894-1.115-1.53-.634-2.36 1.024-3.094 2.687-3.83l.38-.169c.687-.31 1.103-.416 1.42-.498.593-.152.848-.217 1.886-1.348-2.131-1.563-2.902-3.691.016-4.833.56-.219 1.522-.208 2.5-.198 1.19.013 2.403.026 2.936-.374.148-.111.244-.53.33-.904.06-.264.115-.506.18-.598 1.35-1.931 1.234-3.399 1.078-5.39a59.637 59.637 0 01-.068-.926c-.129-2.038-.112-3.909 2.329-4.112 1.004-.084 1.894.39 2.77.858.544.29 1.083.578 1.641.728.875.235 1.1.435 1.321.432.189-.002.375-.152.958-.553 1.187-.818 1.31-2.05 1.434-3.29.11-1.087.219-2.181 1.042-3.013 1.576-1.59 2.798-.63 3.996.31.643.505 1.28 1.005 1.96 1.1 2.546.355 3.064-1.063 3.622-2.59.367-1.005.752-2.058 1.745-2.681 1.829-1.15 2.647-.048 3.434 1.013.499.672.985 1.327 1.709 1.384 1.004.079 2.506-1.093 3.839-2.133.814-.636 1.565-1.221 2.099-1.442 2.269-.936 3.917.064 5.585 1.077 1.408.855 2.83 1.718 4.652 1.434.298-.046.573-.091.831-.134 2.238-.37 3.107-.513 5.446.962 1.69 1.065 2.52.91 3.738.683.606-.113 1.308-.244 2.26-.251 1.111-.009 1.986.497 2.829.984.693.4 1.365.79 2.13.869.423.044.837-.155 1.259-.357.42-.202.848-.407 1.301-.38 1.827.111 2.688 1.493 3.554 2.884.668 1.072 1.339 2.15 2.46 2.652 1.619.726 3.436.248 5.171-.208.783-.206 1.549-.408 2.274-.493 3.959-.464 3.277 1.968 2.549 4.56-.318 1.132-.644 2.295-.595 3.26 1.148.268 2.305-.153 3.46-.573 1.092-.397 2.183-.794 3.264-.607 3.398.586 2.254 4.021 1.442 6.46l-.074.22c.635-.012 1.538-.205 2.552-.422 2.863-.611 6.619-1.414 7.78 1.129.479 1.051.014 2.31-.44 3.537-.313.847-.62 1.678-.607 2.415.026 1.527.71 2.896 1.396 4.267.455.91.912 1.823 1.175 2.783z" fill="'.concat(l,'"/>\n<path d="M186.361 73.608c.254.176.427.296.471.32 1.757.99 3.148 10.9 3.216 14.69.042 2.338.079 11.256-2.394 10.485-.753-.235-1.902-4.956-2.066-7.719-.163-2.763-1.733-12.164-4.141-16.49a11.833 11.833 0 00-.526-.814c-.649-.952-1.437-2.109-.919-2.745.722-.887 1.426-.575 2.259-.207.142.062.287.126.436.187.868.35 2.771 1.672 3.664 2.293z" fill="').concat(l,'"/>\n')},isHat:!1,zIndex:1},dreads02:{path:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M218.208 107.159c-2.491-.992-4.985-3.011-6.257-5.562.47-.117 1.174-.123 1.95-.129 2.266-.018 5.147-.041 4.615-2.867-.563-2.982-5.403-2.067-7.278-1.61.579-.348 1.345-.478 2.12-.61 1.488-.253 3.011-.512 3.314-2.331.531-3.183-3.288-3.076-5.081-2.402-.265-2.118 2.005-3.884 4.141-5.545 1.249-.971 2.452-1.907 3.073-2.855a4.63 4.63 0 01.439-.549c.468-.528.858-.967.307-2.084-1.159-2.346-3.947.328-5.337 1.66-.176.17-.33.317-.455.43.876-1.628 3.321-8.403 2.95-10.122-.546-2.526-2.353-2.615-3.789-.568-.617.881-.939 2.659-1.229 4.26-.148.816-.287 1.585-.453 2.167-.866-.653-1.383-.707-1.699-.74-.428-.044-.488-.05-.548-1.451-.044-1.023.808-2.691 1.558-4.16.408-.8.787-1.542.974-2.088.082-.24.189-.515.305-.814.525-1.355 1.232-3.178.638-4.232-1.776-3.143-3.473 1.172-3.94 2.652-.494-2.137.5-3.973 1.53-5.877.614-1.135 1.241-2.294 1.573-3.554.541-2.048 1.976-7.578-.511-8.561-2.481-.981-2.51 2.123-2.533 4.662-.008.932-.016 1.788-.144 2.337l-.032.135c-.365 1.566-.924 3.964-2.107 4.711-.176.111-2.82.343-2.948.194-1.098-1.281.414-3.527 1.733-5.485.763-1.133 1.461-2.17 1.551-2.867.223-1.73-.44-2.825-2.061-2.928-.462-.03-1.087.365-1.609.694-.392.248-.725.459-.886.423-1.068-.232-.362-3.819.167-6.505.204-1.036.381-1.938.42-2.461.15-2.003-.094-7.172-3.483-4.785.059-.695.111-1.38.163-2.06.15-1.954.296-3.86.571-5.832.052-.371.175-.732.294-1.082.33-.97.634-1.86-.668-2.684-2.156-1.365-3.351 1.492-3.842 3.168-.261.89-.275 1.931-.289 2.95-.032 2.285-.061 4.453-2.869 4.516-3.362.076-2.628-2.415-1.87-4.987.294-.996.591-2.005.655-2.88.128-1.742-1.012-6.422-3.262-3.264-.526.739-.637 2.571-.739 4.26-.072 1.19-.139 2.308-.345 2.923-.559-.249-.366-1.4-.162-2.614.199-1.186.408-2.432-.067-2.95-1.497-1.632-2.818-.353-3.931.725-.42.406-.81.784-1.169.967-.024-.406-.049-.811-.075-1.217v-.006a154.381 154.381 0 01-.173-3.115c-.03-.721.094-1.703.227-2.751.272-2.15.579-4.576-.341-5.597-2.336-2.588-3.822.432-4.505 2.524-.093.288-.175.574-.254.855-.442 1.558-.83 2.928-2.979 3.145.084-1.105-.273-2.706-.645-4.371-.543-2.43-1.116-4.996-.39-6.356.267-.5.667-.587 1.066-.674.428-.093.854-.186 1.113-.785.821-1.903-.524-2.71-1.986-2.772-4.176-.176-3.807 3.317-3.463 6.581.215 2.046.422 4.002-.506 4.91-.543-.515-.531-1.037-.518-1.614.013-.588.028-1.233-.547-1.982-1.223-1.595-3.173-1.46-4.918-.738-.01-.296.063-.92.156-1.71.412-3.506 1.207-10.272-3.236-6.107-.824.774-1.005 1.864-1.184 2.935-.115.687-.228 1.367-.509 1.951-.696 1.445-2.389 3.598-3.341 4.771-.473-1.916.165-4.26.697-6.213l.122-.453c.122-.45.463-1.203.854-2.065.838-1.847 1.905-4.198 1.534-5.179-1.279-3.374-4.632.499-6.525 2.685-.445.514-.809.935-1.047 1.147-1.582 1.41-7.88 6.045-9.901 4.64-.325-.226-.364-.733-.407-1.297-.05-.653-.106-1.381-.62-1.83-.47-.41-2.477-.602-3.05-.55.358-1.493-.346-3.426-2.055-2.91-1.227.372-1.45 1.57-1.669 2.747-.165.884-.327 1.756-.912 2.256-1.5 1.284-3.168.301-4.843-.686-1.148-.676-2.299-1.355-3.401-1.306.072-.308.226-.755.405-1.273.841-2.44 2.224-6.453-1.804-4.871-1.246.49-2.13 3.351-2.441 4.54-.143.55-.242 1.019-.327 1.423-.384 1.825-.489 2.325-3.181 3.027.091-.623.092-1.298.094-1.981.003-1.25.006-2.523.555-3.54.143-.265.408-.616.707-1.012 1.157-1.53 2.81-3.718-.245-4.05-3.767-.41-4.246 4.675-4.575 8.17-.086.903-.161 1.7-.28 2.269-4.123-2.499-6.864.956-9.331 4.065l-.149.187c.447-1.419 1.553-15.557-2.965-11.237-.835.8-.533 1.846-.239 2.868.162.559.32 1.11.29 1.61-.078 1.28-.5 2.422-.996 3.618-.796 1.921-1.72 3.887-2.974 5.524-.306.401-.532.73-.71.99-.317.462-.482.704-.684.74-.222.039-.489-.17-1.047-.61l-.38-.297c-2.424-1.873-3.576-6.623-3.456-9.525.014-.347.055-.752.098-1.182.226-2.249.523-5.202-2.482-4.35-3.02.859-2.062 6.15-1.512 9.188.088.49.167.921.216 1.266.381 2.687.635 5.436.183 8.173-2.297-2.348-3.084.875-3.597 2.978-.153.63-.282 1.158-.42 1.407-.693 1.258-1.841 2.061-2.974 2.853-.467.327-.932.652-1.361 1.007-.423-1.477.273-2.833.93-4.112.585-1.14 1.14-2.22.84-3.268-1.11-3.87-4.103.931-5.117 2.558-.078.125-.143.23-.196.312-.24.373-.688 1.42-1.19 2.594-.796 1.86-1.727 4.038-2.175 4.34-1.023.688-7.605-2.528-8.27-3.141-.559-.513-.77-1.448-.98-2.38-.25-1.111-.5-2.22-1.336-2.61-4.72-2.197-1.932 5.735-1.005 7.375 2.419 4.284 3.516 9.456 2.949 14.504-.858-.302-1.915-1.312-2.468-2.078-.52-.718-.697-1.644-.868-2.535-.183-.955-.359-1.871-.94-2.451-3.288-3.28-3.673 2.878-3.406 4.791.329 2.355 1.213 3.665 2.202 5.13.518.768 1.065 1.579 1.576 2.604.944 1.898.373 4.066-.197 6.232-.256.973-.512 1.946-.63 2.893-3.43-3.3-18.196-.543-14.397 4.502 1.168 1.555 2.462.444 3.796-.7.925-.793 1.869-1.603 2.802-1.55 4.084.225 6.235 5.295 5.967 8.846-.497-1.898-2.421-3.761-3.746-1.444-.796 1.396.32 3.668 1.098 5.254.099.201.193.392.276.569-.906-.445-5.372-2.52-6.246-2.161-3.44 1.414 1.3 4.151 2.537 4.698 4.224 1.868 6.887 3.92 8.2 8.992-1.433-.459-1.847-1.05-2.306-1.704-.298-.427-.616-.88-1.246-1.34-.947-.69-1.397-.705-1.96-.723a4.663 4.663 0 01-1.13-.144l-.071-.019c-2.353-.609-5.397-1.397-8.04-.3-1.969.82-5.286 3.31-5.905 5.651-.757 2.874.844 3.606 2.904 2.143.869-.616 1.486-1.437 2.084-2.234 1.09-1.45 2.12-2.82 4.5-2.727 1.768.07 3.52.996 4.64 2.326.446.53.793 1.19 1.142 1.85.303.574.606 1.15.977 1.645.282.378.751.816 1.237 1.27.724.677 1.485 1.388 1.72 1.984 1.303 3.303-.864 6.272-2.626 8.686-.156.213-.31.423-.457.628-.419-.554-3.477-1.758-4.11-1.878-2.94-.561-4.037.798-2.199 3.512.31.457.801.773 1.29 1.086.425.274.848.546 1.146.908.37.452.656 1.03.945 1.612.266.537.534 1.079.873 1.532.926 1.238 1.997 2.077 3.1 2.941.556.436 1.12.878 1.678 1.381-.325.217-.459.028-.596-.165-.121-.171-.245-.345-.506-.245-.196.076-.462.041-.742.005-.298-.038-.612-.078-.875.009-.463.154-.633.672-.785 1.136-.12.366-.23.699-.463.793-1.912.762-3.835-.574-5.69-1.863-1.344-.935-2.653-1.845-3.896-1.912-1.614-.088-2.975.994-2.2 3.022.435 1.139 2.038 1.858 3.253 2.403.29.13.558.25.783.364 3.246 1.644 6.478 2.868 9.948 1.607 2.797 2.438 6.159 3.641 9.675 3.675-2.012.998-4 2.235-4.703 4.721-.24-.248-.55-.678-.904-1.17-1.405-1.951-3.512-4.877-4.73-1.292-1.044 3.087 3.724 6.871 5.921 8.262-2.555.755-4.677.907-7.277.607-.29-.034-.655-.143-1.038-.258-1.407-.423-3.064-.92-2.2 2.006 1.126 3.827 7.59 2.368 10.133 1.62-1.784 1.498-9.564 11.708-2.811 9.385.959-.33 1.536-1.34 2.14-2.398.768-1.344 1.581-2.767 3.278-2.975 2.478-.304 3.38 1.363 4.413 3.274.427.789.876 1.621 1.469 2.372.386.49 1.304 1.213 2.279 1.981 1.578 1.243 3.306 2.604 3.17 3.284-.091.453-.719.814-1.41 1.211-.76.438-1.598.919-1.883 1.617-.633 1.549-.347 2.746.532 4.078 1.172 1.778 3.09 2.409 4.923 3.012.573.189 1.138.375 1.67.592 3.163 1.295 4.31 2.867 5.728 6.217-2.5.12-9.619 7.36-5.257 8.648 1.12.331 1.348-.254 1.604-.912.115-.295.235-.605.445-.853l.543-1.023.278-.522c.458-1.198.965-1.271 1.52-.221.061-.015.463.082.891.185.43.104.887.215 1.056.225 1.188.073 2.103-.533 3.026-1.144.404-.267.81-.535 1.24-.749.314-.155.625-.254.929-.351.686-.219 1.332-.425 1.866-1.235-.089.135.554-2.511.565-2.536.136-.315.379-.453.628-.594.255-.144.518-.293.682-.64-8.749-9.085-14.457-21.119-15.489-34.464C72.42 132.776 69 128.288 69 123v-13c0-5.035 3.1-9.345 7.497-11.126.531.374 1.27 0 1.503-.842-.463-1.506 3.296-27.854 13-34.876 3.618-2.438 23.008-2.619 42.313-2.606 19.096.014 38.108.195 41.687 2.606 9.704 7.022 13.463 33.37 13 34.876.233.843.972 1.216 1.503.842C193.899 100.655 197 104.965 197 110v13c0 5.288-3.42 9.776-8.168 11.375a55.708 55.708 0 01-11.076 29.289c.209.808.41 1.626.556 2.504.182 1.099.231 2.136.278 3.141.095 2.038.185 3.943 1.367 5.952.19.324.426.593.661.862.332.38.663.758.861 1.282.165.438.206 1.046.248 1.675.094 1.404.195 2.919 1.701 2.92 3.107 0 1.375-5.966.597-7.384a44.374 44.374 0 00-.816-1.411c-1.033-1.733-1.63-2.735-1.567-5.633 1.745 1.16 7.53 3.376 9.448 2.316 3.502-1.934-2.689-3.893-5.825-4.886-.833-.263-1.45-.459-1.613-.567.637-.623 1.309-1.137 1.981-1.65 1.125-.861 2.251-1.721 3.216-3.096.246-.35.488-.732.734-1.119 1.012-1.596 2.091-3.298 3.815-3.382.396-.02 1.045.295 1.774.647 1.459.705 3.235 1.564 3.936.219.727-1.394-.273-1.892-1.158-2.333-.29-.144-.568-.282-.769-.444-.554-.446-.949-.564-1.21-.642-.446-.133-.496-.148-.264-1.492 1.085 1.165 2.789.429 3.244-1.015.29-.922-.157-1.461-.565-1.953-.281-.34-.544-.657-.532-1.061-.012.387.834-5.115.7-4.938.846-1.117 3.811-.794 5.339-.628l.074.008c2.132.231 2.17.307 3.038 2.012l.217.424c.882 1.715 3.198 5.177 3.707.641.121-1.085-.869-3.404-1.45-4.338-.324-.52-.985-.942-1.603-1.335-.578-.369-1.118-.713-1.309-1.092-.477-.945.082-2.478.683-4.126.588-1.612 1.216-3.334.956-4.728.304.117.738.705 1.235 1.379 1.287 1.747 2.996 4.064 3.963.22.324-1.283-1.014-3.267-2.272-5.133-1.487-2.207-2.863-4.247-1.242-4.761 2.289-.726 4.611 2.225 5.25 4.044.195.555.273 1.371.354 2.217.117 1.21.239 2.48.714 3.136 3.036 4.203 3.41-2.741 3.157-4.572-.559-4.026-1.984-6.988-5.623-8.51 1.14-1.414.006-2.575-.916-3.519-.125-.129-.247-.254-.359-.374.556-.603 2.224-.754 4.012-.914 3.123-.281 6.613-.596 5.196-3.413-.394-.784-1.539-1.096-2.512-1.361-.357-.098-.69-.189-.955-.294zM59.49 138.807c.01-.136-.12-.086-.347.104l.347-.104z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:1},frizzle:{path:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M90.91 55.361h84.176c18.247-10.527 21.673-29.21 8.764-45.435-3.214-4.04-8.764 11.75-25.821 12.725-17.058.974-15.42-6.301-33.571-3.577-18.152 2.724-16.146 17.304-27.99 20.803C84.622 43.375 90.91 55.36 90.91 55.36z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:1},shaggyMullet:{path:function(l){return '\n<path d="M177.747 37.856c9.527 7.102 17.761 18.582 18.159 30.824.175 5.507-.617 11.227-1.722 16.616-.504 2.463-1.609 4.661-2.709 6.85-1.066 2.125-2.129 4.24-2.638 6.583-2.627-8.925-10.084-13.97-17.504-18.99-3.953-2.674-7.896-5.341-11.091-8.584 1.016 1.93 2.305 3.695 3.591 5.454 1.24 1.698 2.477 3.392 3.461 5.224-9.247-5.665-18.206-13.88-22.032-24.295-.707 5.398-2.716 10.39-6.108 14.666-3.011 3.796-7.582 7.87-12.295 9.34 2.427-5.507 4.502-11.217 6.407-16.925-1.784 2.316-7.221 11.286-9.611 15.23l-.764 1.26c-1.656 2.72-3.513 5.317-5.507 7.803-.933 1.163-1.929 2.287-2.931 3.391a67.9 67.9 0 01-1.787 1.895c-.041.041-.132.139-.246.261-.492.527-1.421 1.52-.666.545-1.858 2.35-4.451 4.26-6.911 6.07-.473.349-.942.695-1.4 1.039-2.852 2.144-5.96 3.968-9.19 5.476-7.097 3.313-14.383 4.538-22.114 3.199.903.101 2.352-.405 3.53-.817.466-.163.889-.311 1.22-.401 1.809-.492 3.474-1.117 5.113-2.024a53.849 53.849 0 009.176-6.418c-1.365.581-2.6 1.423-3.842 2.27-1.224.834-2.454 1.673-3.822 2.273-2.287 1.003-4.547 1.526-7.032 1.766-5.462.529-11.995-.72-16.721-3.587-5.492-3.333-8.542-9.051-9.99-15.137-1.68-7.067-.636-15.04 3.328-21.074.135 2.143 4.436 3.064 7.916 2.527 3.774-.582 6.95-6.52 10.913-13.926 6.178-11.548 14.268-26.669 29.514-30.64 19.961-5.2 34.209 3.874 35.42 4.657 1.214.784 1.795.629 2.93.326.209-.056.437-.117.691-.178 6.346-1.52 13.258-2.209 19.705-.927 6.34 1.262 12.418 4.546 17.559 8.378z" fill="'.concat(l,'"/>\n<path d="M71.933 110.752c.069.012.137.025.206.036a1.6 1.6 0 01-.206-.036zm7.073 45.439c.8-1.518 1.567-3.052 2.31-4.597A56.209 56.209 0 00109 180.611v8.999a54.395 54.395 0 01-7.726 1.96c-9.013 1.617-34.325-3.528-45.445-11.982-.848-.645-.418-1.917.67-1.992 11.66-.797 17.627-12.134 22.405-21.212l.102-.193zM157 183.053v-2.442a56.18 56.18 0 0018.127-13.713c.715 2.24 1.748 4.333 3.428 5.788 1.321 1.144 3.486 1.127 5.341 1.113h.001a31.76 31.76 0 011.202.004 69.91 69.91 0 005.016-.019c.839-.037 1.213 1.014.534 1.498a8.06 8.06 0 01-.39.262 39.194 39.194 0 01-3.25 1.812c-2.524 1.258-5.187 2.244-7.982 2.734-1.916.337-3.816.4-5.654.177a9.842 9.842 0 001.699 1.941c1.409 1.223 3.72 1.204 5.699 1.189.45-.004.883-.007 1.284.004 1.785.052 3.571.057 5.353-.02.896-.039 1.295 1.084.57 1.601a7.974 7.974 0 01-.416.28 41.968 41.968 0 01-3.468 1.937c-2.694 1.345-5.537 2.398-8.519 2.922-5.499.966-10.869-.177-15.194-3.708a24.898 24.898 0 01-3.381-3.36z" fill="').concat(l,'"/>\n<path d="M81.315 151.594a140.115 140.115 0 01-2.309 4.597l-.102.193c-4.778 9.078-10.745 20.415-22.404 21.212-1.09.075-1.52 1.347-.671 1.992 11.12 8.454 36.432 13.599 45.445 11.982a54.395 54.395 0 007.726-1.96v-8.999a56.205 56.205 0 01-27.685-29.017zM157 180.611v2.442a24.898 24.898 0 003.381 3.36c4.325 3.531 9.695 4.674 15.194 3.708 2.982-.524 5.825-1.577 8.519-2.922a41.968 41.968 0 003.468-1.937c.139-.087.278-.181.416-.28.725-.517.326-1.64-.57-1.601a74.062 74.062 0 01-5.353.02 36.241 36.241 0 00-1.284-.004c-1.979.015-4.29.034-5.699-1.189a9.842 9.842 0 01-1.699-1.941c1.838.223 3.738.16 5.654-.177 2.795-.49 5.458-1.476 7.982-2.734a39.194 39.194 0 003.25-1.812c.13-.081.26-.17.39-.262.679-.484.305-1.535-.534-1.498a69.91 69.91 0 01-5.016.019 31.82 31.82 0 00-1.203-.004c-1.855.014-4.02.031-5.341-1.113-1.68-1.455-2.713-3.548-3.428-5.788A56.18 56.18 0 01157 180.611z" fill="#000" fill-opacity=".16"/>\n')},isHat:!1,zIndex:0},shaggy:{path:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M88.183 37.856c5.141-3.832 11.219-7.116 17.559-8.378 6.447-1.282 10.359-1.593 16.705-.073 1.633.392 2.184.78 3.621-.148 1.211-.783 9.662-9.49 35.42-4.657 26.035 4.885 33.769 44.075 43.427 45.566 3.48.537 7.782-.384 7.916-2.527 3.964 6.034 5.008 14.007 3.327 21.074-1.446 6.086-4.496 11.804-9.989 15.137-4.725 2.867-11.259 4.116-16.721 3.587-2.485-.24-4.745-.763-7.031-1.766-2.759-1.209-4.957-3.391-7.665-4.543a53.896 53.896 0 009.176 6.418c1.64.907 3.304 1.532 5.113 2.024 1.236.336 3.762 1.481 4.956 1.182-7.807 1.396-15.16.18-22.319-3.163-3.231-1.508-6.339-3.332-9.191-5.476-2.833-2.13-6.094-4.307-8.311-7.11.931 1.204-.697-.586-.912-.805a67.764 67.764 0 01-1.787-1.895 74.075 74.075 0 01-2.931-3.391c-1.993-2.486-3.851-5.082-5.507-7.803-1.677-2.756-8.358-13.873-10.375-16.49 1.905 5.708 3.98 11.418 6.407 16.925-4.713-1.47-9.283-5.544-12.295-9.34-3.392-4.276-5.4-9.268-6.108-14.666-3.825 10.416-12.785 18.63-22.032 24.295 2.003-3.73 5.056-6.885 7.052-10.678-9.19 9.329-24.568 13.893-28.595 27.574-1.032-4.758-4.353-8.58-5.347-13.433-1.105-5.389-1.897-11.11-1.722-16.616.398-12.242 8.632-23.723 18.16-30.824z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:2},shortCurly:{path:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M193.765 70.766c-.264-3.317-.732-6.614-1.518-9.855-.625-2.576-1.478-5.034-2.487-7.491-.609-1.485-2.032-3.524-2.2-5.126-.165-1.577 1.067-3.325 1.329-5.162a15.975 15.975 0 00-.155-5.438c-.833-4.023-3.594-7.764-7.857-8.813-.952-.234-2.964.055-3.636-.5-.771-.635-1.308-2.8-2.006-3.669-1.991-2.476-5.095-4.07-8.369-3.514-2.411.409-1.027.907-2.834-.512-1.005-.788-1.756-1.993-2.732-2.847-1.467-1.283-3.15-2.38-4.892-3.282-4.557-2.358-9.754-4.072-14.844-4.908-9.285-1.524-19.195-.195-28.195 2.22-4.479 1.201-8.987 2.726-13.147 4.743-1.783.864-2.813 1.582-4.672 1.808-2.93.357-5.41.339-8.184 1.581-8.536 3.822-12.381 12.689-9.06 21.174a14.637 14.637 0 002.82 4.584c1.521 1.68 2.072 1.35.762 3.282a52.785 52.785 0 00-4.955 9.172c-3.529 8.402-4.12 17.864-3.89 26.824.081 3.137.216 6.313.71 9.42.214 1.344.274 3.872 1.282 4.87.512.506 1.241.788 1.969.587 1.71-.474 1.121-1.735 1.161-2.906.2-5.884-.07-11.089 1.33-16.901 1.033-4.295 2.755-8.195 4.988-12.036 2.838-4.884 5.903-9.173 9.806-13.355.918-.984 1.119-1.4 2.35-1.472.931-.054 2.295.584 3.2.805 1.999.487 4 .968 6.034 1.296 3.74.603 7.444.644 11.217.525 7.426-.232 14.885-.753 22.085-2.623 4.782-1.242 9.022-3.47 13.602-5.105.082-.029 1.23-.847 1.431-.814.281.047 1.977 1.826 2.263 2.05 2.226 1.746 4.667 2.479 7.07 3.83 2.964 1.667.094-.718 1.728 1.359.477.605.721 1.726 1.103 2.411a18.086 18.086 0 004.931 5.624c1.955 1.47 4.893 2.18 5.89 4.095.769 1.477 1.028 3.484 1.648 5.06 1.628 4.136 3.777 7.992 5.926 11.887 1.732 3.14 3.625 5.881 3.818 9.468.067 1.248-1.121 8.737 1.773 6.46.429-.338 1.353-4.156 1.543-4.804.772-2.633 1.046-5.381 1.395-8.086.694-5.38.923-10.498.469-15.916z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:1},shortFlat:{path:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M180.15 39.92c-2.76-2.82-5.964-5.213-9.081-7.613-.687-.53-1.386-1.046-2.058-1.595-.153-.125-1.719-1.246-1.906-1.659-.451-.993-.19-.22-.128-1.404.079-1.498 3.134-5.73.854-6.7-1.003-.427-2.791.709-3.753 1.084a59.558 59.558 0 01-5.731 1.9c.932-1.857 2.708-5.573-.631-4.579-2.602.775-5.026 2.768-7.64 3.705.865-1.418 4.324-5.811 1.198-6.057-.972-.076-3.803 1.748-4.85 2.138-3.137 1.165-6.341 1.92-9.634 2.513-11.198 2.018-24.293 1.442-34.653 6.54-7.987 3.93-15.874 10.029-20.489 17.794-4.447 7.486-6.11 15.677-7.041 24.254-.683 6.295-.739 12.802-.42 19.119.105 2.07.338 11.611 3.345 8.721 1.498-1.44 1.487-7.253 1.864-9.22.751-3.916 1.474-7.848 2.726-11.638 2.206-6.68 4.809-13.793 10.305-18.393 3.527-2.952 6.004-6.941 9.379-9.919 1.516-1.337.359-1.198 2.797-1.022 1.638.117 3.282.162 4.923.205 3.796.099 7.598.074 11.395.087 7.647.028 15.258.136 22.898-.265 3.395-.177 6.799-.274 10.185-.588 1.891-.175 5.247-1.387 6.804-.461 1.425.847 2.905 3.615 3.928 4.748 2.418 2.679 5.3 4.724 8.126 6.92 5.895 4.58 8.87 10.332 10.661 17.488 1.783 7.13 1.283 13.745 3.49 20.762.389 1.234 1.416 3.36 2.682 1.454.235-.354.175-2.3.175-3.42 0-4.52 1.144-7.91 1.13-12.46-.056-13.832-.504-31.868-10.85-42.439z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:1},shortRound:{path:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M167.309 35.006c-20.188-11.7-40.18-9.784-55.272-5.976-15.092 3.808-24.02 14.621-31.68 30.618-3.761 7.855-5.991 17.143-6.334 25.833-.135 3.412.325 6.934 1.245 10.22.337 1.205 2.155 5.386 2.654 2.008.166-1.125-.442-2.676-.5-3.871-.078-1.569.005-3.157.112-4.723.2-2.928.722-5.8 1.65-8.59 1.328-3.988 3.017-8.312 5.603-11.677 6.401-8.328 17.482-8.802 26.279-13.384-.763 1.405-3.706 3.68-2.687 5.263.705 1.094 3.37.762 4.643.727 3.349-.092 6.713-.674 10.021-1.147 5.213-.745 10.098-2.255 15.004-4.089 4.016-1.502 8.603-2.892 11.622-6.078 4.871 5.048 11.141 9.794 17.401 13.003 5.618 2.88 14.679 4.318 18.113 10.158 4.065 6.914 2.195 15.406 3.436 22.9.472 2.85 1.545 2.786 2.132.237.997-4.33 1.468-8.828 1.151-13.279-.718-10.048-4.405-36.453-24.593-48.153z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:1},sides:{path:function(l){return '\n<path d="M70 97c0 3.994.924 5.071 6 5 3.255-.051 3.443-6.005 3.652-12.589.139-4.374.286-9.027 1.348-12.411.619-4.432-1.824-3.17-3-1-3.96 4.778-8 15.344-8 21zm126 0c0 3.994-.924 5.071-6 5-3.255-.051-3.443-6.005-3.652-12.589-.139-4.374-.286-9.027-1.348-12.411-.619-4.432 1.824-3.17 3-1 3.959 4.778 8 15.344 8 21z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:1},shortWaved:{path:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M183.68 38.949c5.406-4.95 6.707-14.987 3.638-21.5-3.769-7.995-11.417-8.997-18.746-5.48-6.908 3.315-13.057 4.419-20.622 2.813-7.258-1.541-14.144-4.26-21.647-4.706-12.325-.733-24.3 3.839-32.7 13.053-1.603 1.758-2.894 3.768-4.115 5.805-.977 1.63-2.078 3.38-2.493 5.258-.198.894.17 3.098-.275 3.83-.48.79-2.296 1.515-3.069 2.102-1.567 1.188-2.924 2.53-4.18 4.047-2.666 3.222-4.133 6.587-5.368 10.572-4.102 13.245-4.45 28.998.854 42.004.707 1.734 2.898 5.352 4.186 1.638.255-.734-.334-3.194-.333-3.935.005-2.72 1.506-20.729 8.047-30.817 2.13-3.284 11.973-15.58 13.984-15.68 1.065 1.693 11.88 12.51 39.942 11.242 12.662-.572 22.4-6.26 24.738-8.727 1.028 5.533 12.992 13.816 14.815 17.224 5.267 9.846 6.435 30.304 8.445 30.265 2.01-.038 3.453-5.237 3.867-6.23 3.072-7.375 3.595-16.632 3.267-24.559-.427-10.202-4.638-21.226-12.235-28.22z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:1},theCaesarAndSidePart:{path:function(l){return '\n<path d="M78 98c-.327 1.223-1.653 1.488-2 0-.719-10.298 0-62.274 57-63 57-.726 57.719 52.702 57 63-.347 1.488-1.673 1.223-2 0 .463-1.554-3.296-28.752-13-36-1.759-1.224-7.247-2.39-14.641-3.261L164 50l-6.982 8.379c-7.032-.694-15.361-1.127-23.705-1.133C114.008 57.232 94.618 59.483 91 62c-9.704 7.248-13.463 34.446-13 36z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:1},theCaesar:{path:function(l){return '\n<path fill-rule="evenodd" clip-rule="evenodd" d="M76 98c.347 1.488 1.673 1.223 2 0-.463-1.554 3.296-28.752 13-36 3.618-2.517 23.008-4.768 42.313-4.754C152.409 57.259 171.421 59.51 175 62c9.704 7.248 13.463 34.446 13 36 .327 1.223 1.653 1.488 2 0 .719-10.298 0-63.726-57-63-57 .726-57.719 52.702-57 63z" fill="'.concat(l,'"/>\n')},isHat:!1,zIndex:1}};function s(l){return l.filter((function(l,e,a){return a.indexOf(l)===e}))}function h(l){return function(l){if(Array.isArray(l))return z(l)}(l)||function(l){if("undefined"!=typeof Symbol&&null!=l[Symbol.iterator]||null!=l["@@iterator"])return Array.from(l)}(l)||function(l,e){if(!l)return;if("string"==typeof l)return z(l,e);var a=Object.prototype.toString.call(l).slice(8,-1);"Object"===a&&l.constructor&&(a=l.constructor.name);if("Map"===a||"Set"===a)return Array.from(l);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return z(l,e)}(l)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function z(l,e){(null==e||e>l.length)&&(e=l.length);for(var a=0,c=new Array(e);a<e;a++)c[a]=l[a];return c}var v={auburn:"#A55728",black:"#2C1B18",blonde:"#B58143",blondeGolden:"#D6B370",brown:"#724133",brownDark:"#4A312C",pastelPink:"#F59797",platinum:"#ECDCBF",red:"#C93305",silverGray:"#E8E1E1"},y={black:"#262E33",blue01:"#65C9FF",blue02:"#5199E4",blue03:"#25557C",gray01:"#E5E5E5",gray02:"#929598",heather:"#3C4F5C",pastelBlue:"#B1E2FF",pastelGreen:"#A7FFC4",pastelOrange:"#FFDEB5",pastelRed:"#FFAFB9",pastelYellow:"#FFFFB1",pink:"#FF488E",red:"#FF5C5C",white:"#FFFFFF"},m={tanned:"#FD9841",yellow:"#F9D562",pale:"#FFDBB4",light:"#EDB98A",brown:"#D08B5B",darkBrown:"#AE5D29",black:"#614335"};function M(l,e){var c=[],n={longHair:["bigHair","bob","bun","curly","curvy","dreads","frida","fro","froAndBand","miaWallace","longButNotTooLong","shavedSides","straight01","straight02","straightAndStrand"],bigHair:["bigHair"],bob:["bob"],bun:["bun"],curly:["curly"],curvy:["curvy"],dreads:["dreads"],frida:["frida"],fro:["fro"],froAndBand:["froAndBand"],miaWallace:["miaWallace"],longButNotTooLong:["longButNotTooLong"],shavedSides:["shavedSides"],straight01:["straight01"],straight02:["straight02"],straightAndStrand:["straightAndStrand"],shortHair:["dreads01","dreads02","frizzle","shaggy","shaggyMullet","shortCurly","shortFlat","shortRound","shortWaved","sides","theCaesar","theCaesarAndSidePart"],dreads01:["dreads01"],dreads02:["dreads02"],frizzle:["frizzle"],shaggy:["shaggy"],shaggyMullet:["shaggyMullet"],shortCurly:["shortCurly"],shortFlat:["shortFlat"],shortRound:["shortRound"],shortWaved:["shortWaved"],sides:["sides"],theCaesar:["theCaesar"],theCaesarAndSidePart:["theCaesarAndSidePart"],eyepatch:["eyepatch"],hat:["hat"],winterHat01:["winterHat01"],winterHat02:["winterHat02"],winterHat03:["winterHat03"],winterHat04:["winterHat04"],hijab:["hijab"],turban:["turban"]};Object.keys(n).forEach((function(e){var t=n[e];a("top",e,l)&&c.push.apply(c,h(t));}));var t=e.pick(c);return !1===e.bool(void 0!==l.topChance?l.topChance:100)?{path:function(){return ""},isHat:!1,zIndex:0}:p[t]}var C=function(l){var e,p=l.prng,z=l.options,C=f,b=u,g=function(l,e){var c=[];["tanned","yellow","pale","light","brown","darkBrown","black"].forEach((function(e){a("skin",e,l)&&c.push(e);}));var n=e.pick(c);return m[n]}(z,p),w=M(z,p),A=function(l,e){var c=[],n={medium:["beardMedium"],beardMedium:["beardMedium"],light:["beardLight"],beardLight:["beardLight"],majestic:["beardMajestic"],beardMajestic:["beardMajestic"],fancy:["moustaceFancy"],moustaceFancy:["moustaceFancy"],magnum:["moustacheMagnum"],moustacheMagnum:["moustacheMagnum"]};Object.keys(n).forEach((function(e){var t=n[e];a("facialHair",e,l)&&c.push.apply(c,h(t));}));var t=e.pick(s(c));if(!1!==e.bool(void 0!==l.facialHairChance?l.facialHairChance:10))return d[t]}(z,p),H=function(l,e){var c=[],n={auburn:["auburn"],black:["black"],blonde:["blonde"],blondeGolden:["blondeGolden"],brown:["brown"],brownDark:["brownDark"],pastel:["pastelPink"],pastelPink:["pastelPink"],platinum:["platinum"],red:["red"],gray:["silverGray"],silverGray:["silverGray"]};Object.keys(n).forEach((function(e){var t=n[e];a("facialHairColor",e,l)&&c.push.apply(c,h(t));}));var t=e.pick(s(c));return v[t]}(z,p),k=function(l,e){var c=[],t={blazer:["blazerAndShirt","blazerAndSweater"],blazerAndShirt:["blazerAndShirt"],blazerAndSweater:["blazerAndSweater"],sweater:["collarAndSweater"],collarAndSweater:["collarAndSweater"],shirt:["graphicShirt","shirtCrewNeck","shirtScoopNeck","shirtVNeck"],graphicShirt:["graphicShirt"],shirtCrewNeck:["shirtCrewNeck"],shirtScoopNeck:["shirtScoopNeck"],shirtVNeck:["shirtVNeck"],hoodie:["hoodie"],overall:["overall"]};Object.keys(t).forEach((function(e){var n=t[e];a("clothes",e,l)&&c.push.apply(c,h(n));}));var i=e.pick(s(c));return n[i]}(z,p),F=function(l,e){var c=[];["bat","bear","deer","diamond","cumbia","hola","pizza","resist","skull","skullOutline"].forEach((function(e){a("clotheGraphics",e,l)&&c.push(e);}));var n=e.pick(c);return t[n]}(z,p),x=function(l,e){var c=[],n={black:["black"],blue:["blue01","blue02","blue03"],blue01:["blue01"],blue02:["blue02"],blue03:["blue03"],gray:["gray01","gray02"],gray01:["gray01"],gray02:["gray02"],heather:["heather"],pastel:["pastelBlue","pastelGreen","pastelOrange","pastelRed","pastelYellow"],pastelBlue:["pastelBlue"],pastelGreen:["pastelGreen"],pastelOrange:["pastelOrange"],pastelRed:["pastelRed"],pastelYellow:["pastelYellow"],pink:["pink"],red:["red"],white:["white"]};Object.keys(n).forEach((function(e){var t=n[e];a("clothesColor",e,l)&&c.push.apply(c,h(t));}));var t=e.pick(s(c));return y[t]}(z,p),V=function(l,e){var c=[],n={close:["closed"],closed:["closed"],cry:["cry"],default:["default"],dizzy:["xDizzy"],xDizzy:["xDizzy"],roll:["eyeRoll"],eyeRoll:["eyeRoll"],happy:["happy"],hearts:["hearts"],side:["side"],squint:["squint"],surprised:["surprised"],wink:["wink"],winkWacky:["winkWacky"]};Object.keys(n).forEach((function(e){var t=n[e];a("eyes",e,l)&&c.push.apply(c,h(t));}));var t=e.pick(s(c));return r[t]}(z,p),S=function(l,e){var c=[],n={angry:["angry"],angryNatural:["angryNatural"],default:["default"],defaultNatural:["defaultNatural"],flat:["flatNatural"],flatNatural:["flatNatural"],raised:["raisedExcited","raisedExcitedNatural"],raisedExcited:["raisedExcited"],raisedExcitedNatural:["raisedExcitedNatural"],sad:["sadConcerned","sadConcernedNatural"],sadConcerned:["sadConcerned"],sadConcernedNatural:["sadConcernedNatural"],unibrow:["unibrowNatural"],unibrowNatural:["unibrowNatural"],up:["upDown","upDownNatural"],upDown:["upDown"],upDownNatural:["upDownNatural"],frown:["frownNatural"],frownNatural:["frownNatural"]};Object.keys(n).forEach((function(e){var t=n[e];a("eyebrow",e,l)&&c.push.apply(c,h(t));}));var t=e.pick(s(c));return i[t]}(z,p),E=function(l,e){var c=[],n={concerned:["concerned"],default:["default"],disbelief:["disbelief"],eating:["eating"],grimace:["grimace"],sad:["sad"],scream:["screamOpen"],screamOpen:["screamOpen"],serious:["serious"],smile:["smile"],tongue:["tongue"],twinkle:["twinkle"],vomit:["vomit"]};Object.keys(n).forEach((function(e){var t=n[e];a("mouth",e,l)&&c.push.apply(c,h(t));}));var t=e.pick(s(c));return o[t]}(z,p),N=function(l,e){var n=[];["kurt","prescription01","prescription02","round","sunglasses","wayfarers"].forEach((function(e){a("accessories",e,l)&&n.push(e);}));var t=e.pick(s(n));if(!1!==e.bool(void 0!==l.accessoriesChance?l.accessoriesChance:10))return c[t]}(z,p),B=function(l,e){var c=[],n={black:["black"],blue:["blue01","blue02","blue03"],blue01:["blue01"],blue02:["blue02"],blue03:["blue03"],gray:["gray01","gray02"],gray01:["gray01"],gray02:["gray02"],heather:["heather"],pastel:["pastelBlue","pastelGreen","pastelOrange","pastelRed","pastelYellow"],pastelBlue:["pastelBlue"],pastelGreen:["pastelGreen"],pastelOrange:["pastelOrange"],pastelRed:["pastelRed"],pastelYellow:["pastelYellow"],pink:["pink"],red:["red"],white:["white"]};Object.keys(n).forEach((function(e){var t=n[e];a("accessoriesColor",e,l)&&c.push.apply(c,h(t));}));var t=e.pick(s(c));return y[t]}(z,p),D=function(l,e){var c=[],n={black:["black"],blue:["blue01","blue02","blue03"],blue01:["blue01"],blue02:["blue02"],blue03:["blue03"],gray:["gray01","gray02"],gray01:["gray01"],gray02:["gray02"],heather:["heather"],pastel:["pastelBlue","pastelGreen","pastelOrange","pastelRed","pastelYellow"],pastelBlue:["pastelBlue"],pastelGreen:["pastelGreen"],pastelOrange:["pastelOrange"],pastelRed:["pastelRed"],pastelYellow:["pastelYellow"],pink:["pink"],red:["red"],white:["white"]};Object.keys(n).forEach((function(e){var t=n[e];a("hatColor",e,l)&&c.push.apply(c,h(t));}));var t=e.pick(s(c));return y[t]}(z,p),O=function(l,e){var c=[],n={auburn:["auburn"],black:["black"],blonde:["blonde"],blondeGolden:["blondeGolden"],brown:["brown"],brownDark:["brownDark"],pastel:["pastelPink"],pastelPink:["pastelPink"],platinum:["platinum"],red:["red"],gray:["silverGray"],silverGray:["silverGray"]};Object.keys(n).forEach((function(e){var t=n[e];a("hairColor",e,l)&&c.push.apply(c,h(t));}));var t=e.pick(s(c));return v[t]}(z,p),I=function(l,e,a){return l.length>0?'<g transform="translate('.concat(e,", ").concat(a,')">').concat(l,"</g>"):""},G=I(w.path(w.isHat?D:O),7,0),_="\n".concat(I(b(g),40,36),"\n").concat(I(k(x,F()),8,170),"\n").concat(I(E(),86,134),"\n").concat(I(C(),112,122),"\n").concat(I(V(),84,90),"\n").concat(I(S(),84,82),"\n").concat(0===w.zIndex?G:"","\n").concat(A?I(A(H),56,72):"","\n").concat(1===w.zIndex?G:"","\n").concat(N?I(N(B),69,85):"","\n").concat(2===w.zIndex?G:"","\n");"circle"===z.style&&(_='\n<path d="M260 160c0 66.274-53.726 120-120 120S20 226.274 20 160 73.726 40 140 40s120 53.726 120 120z" fill="'.concat(null!==(e=z.background)&&void 0!==e?e:y.blue01,'"/>\n<mask id="a" maskUnits="userSpaceOnUse" x="8" y="0" width="264" height="280">\n<path fill-rule="evenodd" clip-rule="evenodd" d="M272 0H8v160h12c0 66.274 53.726 120 120 120s120-53.726 120-120h12V0z" fill="#fff"/>\n</mask>\n<g mask="url(#a)">\n').concat(_,"\n</g>\n"),z.background=void 0);return {attributes:{viewBox:"0 0 280 280",fill:"none"},body:_}},b={title:"Avataaars",creator:"Pablo Stanley",contributor:"Florian Körner",source:"https://avataaars.com/",license:{name:"Other - Free for personal and commercial use",url:"https://avataaars.com/"}},g={title:"Options",$schema:"http://json-schema.org/draft-07/schema#",properties:{style:{title:"Style",type:"string",enum:["transparent","circle"]},mode:{title:"Mode",description:"@deprecated",type:"string",enum:["include","exclude"]},top:{title:"Top",type:"array",items:{type:"string",enum:["longHair","shortHair","eyepatch","hat","hijab","turban","bigHair","bob","bun","curly","curvy","dreads","frida","fro","froAndBand","miaWallace","longButNotTooLong","shavedSides","straight01","straight02","straightAndStrand","dreads01","dreads02","frizzle","shaggy","shaggyMullet","shortCurly","shortFlat","shortRound","shortWaved","sides","theCaesar","theCaesarAndSidePart","winterHat01","winterHat02","winterHat03","winterHat04"]}},topChance:{title:"Top Probability",type:"integer",minimum:0,maximum:100},hatColor:{title:"Hat Color",type:"array",items:{type:"string",enum:["black","blue","blue01","blue02","blue03","gray","gray01","gray02","heather","pastel","pastelBlue","pastelGreen","pastelOrange","pastelRed","pastelYellow","pink","red","white"]}},hairColor:{title:"Hair Color",type:"array",items:{type:"string",enum:["auburn","black","blonde","blondeGolden","brown","brownDark","pastel","pastelPink","platinum","red","gray","silverGray"]}},accessories:{title:"Accessories",type:"array",items:{type:"string",enum:["kurt","prescription01","prescription02","round","sunglasses","wayfarers"]}},accessoriesChance:{title:"Accessories Probability",type:"integer",minimum:0,maximum:100},accessoriesColor:{title:"Accessories Color",type:"array",items:{type:"string",enum:["black","blue","blue01","blue02","blue03","gray","gray01","gray02","heather","pastel","pastelBlue","pastelGreen","pastelOrange","pastelRed","pastelYellow","pink","red","white"]}},facialHair:{title:"Facial Hair",type:"array",items:{type:"string",enum:["medium","beardMedium","light","beardLight","majestic","beardMajestic","fancy","moustaceFancy","magnum","moustacheMagnum"]}},facialHairChance:{title:"Facial Hair Probability",type:"integer",minimum:0,maximum:100},facialHairColor:{title:"Facial Hair Color",type:"array",items:{type:"string",enum:["auburn","black","blonde","blondeGolden","brown","brownDark","pastel","pastelPink","platinum","red","gray","silverGray"]}},clothes:{title:"Clothes",type:"array",items:{type:"string",enum:["blazer","blazerAndShirt","blazerAndSweater","sweater","collarAndSweater","shirt","graphicShirt","shirtCrewNeck","shirtScoopNeck","shirtVNeck","hoodie","overall"]}},clothesColor:{title:"Clothes Color",type:"array",items:{type:"string",enum:["black","blue","blue01","blue02","blue03","gray","gray01","gray02","heather","pastel","pastelBlue","pastelGreen","pastelOrange","pastelRed","pastelYellow","pink","red","white"]}},eyes:{title:"Eyes",type:"array",items:{type:"string",enum:["close","closed","cry","default","dizzy","xDizzy","roll","eyeRoll","happy","hearts","side","squint","surprised","wink","winkWacky"]}},eyebrow:{title:"Eyebrow",type:"array",items:{type:"string",enum:["angry","angryNatural","default","defaultNatural","flat","flatNatural","raised","raisedExcited","raisedExcitedNatural","sad","sadConcerned","sadConcernedNatural","unibrow","unibrowNatural","up","upDown","upDownNatural","frown","frownNatural"]}},mouth:{title:"Mouth",type:"array",items:{type:"string",enum:["concerned","default","disbelief","eating","grimace","sad","scream","screamOpen","serious","smile","tongue","twinkle","vomit"]}},skin:{title:"Skin",type:"array",items:{type:"string",enum:["tanned","yellow","pale","light","brown","darkBrown","black"]}},clotheGraphics:{title:"Clothe Graphics",type:"array",items:{type:"string",enum:["skullOutline","skull","resist","pizza","hola","diamond","deer","cumbia","bear","bat"]}}},additionalProperties:!1},w=e.utils.style.createLegacyWrapper({create:C,meta:b,schema:g});l.create=C,l.default=w,l.meta=b,l.schema=g,Object.defineProperty(l,"__esModule",{value:!0});}));
    });

    var index_umd$1 = /*@__PURE__*/getDefaultExportFromCjs(index_umd);

    var style = /*#__PURE__*/Object.freeze(/*#__PURE__*/_mergeNamespaces({
        __proto__: null,
        'default': index_umd$1
    }, [index_umd]));

    /* src/parts/Avataaar.svelte generated by Svelte v3.44.1 */
    const file$7 = "src/parts/Avataaar.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_style(div, "width", /*width*/ ctx[0] + "px");
    			add_location(div, file$7, 134, 0, 2383);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = /*svg*/ ctx[1];

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*svg*/ 2) div.innerHTML = /*svg*/ ctx[1];
    			if (dirty & /*width*/ 1) {
    				set_style(div, "width", /*width*/ ctx[0] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Avataaar', slots, []);
    	let { seed = Math.random(), gender = undefined, width = 48 } = $$props;

    	const settings = {
    		unknown: {
    			backgroundColor: '#ccc0',
    			style: 'circle',
    			top: [
    				'longHair',
    				'shortHair',
    				'hijab',
    				'turban',
    				'bigHair',
    				'bob',
    				'bun',
    				'curly',
    				'curvy',
    				'dreads',
    				'fro',
    				'froAndBand',
    				'miaWallace',
    				'longButNotTooLong',
    				'shavedSides',
    				'straight01',
    				'straight02',
    				'straightAndStrand',
    				'dreads01',
    				'dreads02',
    				'frizzle',
    				'shaggy',
    				'shaggyMullet',
    				'shortCurly',
    				'shortFlat',
    				'shortRound',
    				'shortWaved',
    				'sides',
    				'theCaesar',
    				'theCaesarAndSidePart'
    			],
    			topChance: 90,
    			accessories: ['prescription01', 'prescription02', 'round'],
    			accessoriesChance: 30,
    			facialHairChance: 0,
    			eyes: ['default'],
    			eyebrow: [
    				'default',
    				'defaultNatural',
    				'flat',
    				'flatNatural',
    				'raised',
    				'raisedExcited',
    				'raisedExcitedNatural',
    				'unibrowNatural',
    				'up',
    				'upDown',
    				'upDownNatural',
    				'frownNatural'
    			],
    			mouth: ['serious']
    		},
    		male: {
    			top: [
    				'shortHair',
    				//'turban',
    				'dreads01',
    				'dreads02',
    				'frizzle',
    				'shaggy',
    				'shaggyMullet',
    				'shortCurly',
    				'shortFlat',
    				'shortRound',
    				'shortWaved',
    				'sides',
    				'theCaesar',
    				'theCaesarAndSidePart'
    			],
    			topChance: 75,
    			facialHairChance: 25,
    			clothes: [
    				'blazer',
    				'blazerAndShirt',
    				'blazerAndSweater',
    				'sweater',
    				'collarAndSweater',
    				'shirt',
    				'graphicShirt',
    				'shirtCrewNeck',
    				'shirtVNeck',
    				'hoodie'
    			]
    		},
    		female: {
    			top: [
    				'longHair',
    				'hijab',
    				'bigHair',
    				'bob',
    				'bun',
    				'curly',
    				'curvy',
    				'dreads',
    				'fro',
    				'froAndBand',
    				'miaWallace',
    				'longButNotTooLong',
    				'shavedSides',
    				'straight01',
    				'straight02',
    				'straightAndStrand',
    				'frizzle',
    				'shaggy',
    				'shaggyMullet',
    				'shortCurly',
    				'shortFlat',
    				'shortRound',
    				'shortWaved'
    			],
    			topChance: 100
    		}
    	};

    	const avatar = seed => // https://avatars.dicebear.com/styles/avataaars#base-options
    	index_umd$2.createAvatar(style, {
    		seed: '' + seed,
    		...settings.unknown,
    		...settings?.[gender]
    	});

    	let svg = avatar(seed);
    	const writable_props = ['seed', 'gender', 'width'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Avataaar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(1, svg = avatar(String(Math.random())));
    	};

    	$$self.$$set = $$props => {
    		if ('seed' in $$props) $$invalidate(3, seed = $$props.seed);
    		if ('gender' in $$props) $$invalidate(4, gender = $$props.gender);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    	};

    	$$self.$capture_state = () => ({
    		createAvatar: index_umd$2.createAvatar,
    		style,
    		seed,
    		gender,
    		width,
    		settings,
    		avatar,
    		svg
    	});

    	$$self.$inject_state = $$props => {
    		if ('seed' in $$props) $$invalidate(3, seed = $$props.seed);
    		if ('gender' in $$props) $$invalidate(4, gender = $$props.gender);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('svg' in $$props) $$invalidate(1, svg = $$props.svg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, svg, avatar, seed, gender, click_handler];
    }

    class Avataaar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { seed: 3, gender: 4, width: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Avataaar",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get seed() {
    		throw new Error("<Avataaar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set seed(value) {
    		throw new Error("<Avataaar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gender() {
    		throw new Error("<Avataaar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gender(value) {
    		throw new Error("<Avataaar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Avataaar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Avataaar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/parts/Icon.svelte generated by Svelte v3.44.1 */

    const file$6 = "src/parts/Icon.svelte";

    // (314:31) 
    function create_if_block_8(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "d", "M3.26172 6.58008C4.64243 6.58008 5.76172 5.46079 5.76172 4.08008H5.74172C5.74176 2.70714 4.63461 1.59106 3.26172 1.58008C1.88101 1.58008 0.761719 2.69937 0.761719 4.08008C0.761719 5.46079 1.88101 6.58008 3.26172 6.58008Z");
    			attr_dev(path0, "stroke", "black");
    			attr_dev(path0, "stroke-width", "1.5");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-10lcuad");
    			add_location(path0, file$6, 321, 3, 10233);
    			attr_dev(path1, "d", "M15.7617 13.4401C14.5798 13.4401 13.6217 14.3982 13.6217 15.5801V22.8301H8.51172V8.90008H13.6217V10.4901C14.8194 9.47613 16.3326 8.91047 17.9017 8.89008C21.0717 8.89008 23.2717 11.2401 23.2717 15.7001V22.8301H17.9017V15.5801C17.9044 15.0108 17.6801 14.4639 17.2785 14.0604C16.8769 13.6569 16.331 13.4301 15.7617 13.4301V13.4401Z");
    			attr_dev(path1, "stroke", "black");
    			attr_dev(path1, "stroke-width", "1.5");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-10lcuad");
    			add_location(path1, file$6, 328, 3, 10574);
    			attr_dev(path2, "d", "M5.67172 22.8301H0.811719V8.90008H5.67172V22.8301Z");
    			attr_dev(path2, "stroke", "black");
    			attr_dev(path2, "stroke-width", "1.5");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "class", "svelte-10lcuad");
    			add_location(path2, file$6, 335, 3, 11023);
    			attr_dev(svg, "width", "25");
    			attr_dev(svg, "height", "25");
    			attr_dev(svg, "viewBox", "0 0 25 25");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-10lcuad");
    			add_location(svg, file$6, 314, 2, 10116);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(314:31) ",
    		ctx
    	});

    	return block;
    }

    // (277:32) 
    function create_if_block_7(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "fill-rule", "evenodd");
    			attr_dev(path0, "clip-rule", "evenodd");
    			attr_dev(path0, "d", "M3.57764 15.3496C5.02738 15.3496 6.20264 14.1744 6.20264 12.7246C6.20264 11.2749 5.02738 10.0996 3.57764 10.0996C2.12789 10.0996 0.952637 11.2749 0.952637 12.7246C0.952637 14.1744 2.12789 15.3496 3.57764 15.3496Z");
    			attr_dev(path0, "stroke", "black");
    			attr_dev(path0, "stroke-width", "1.5");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-10lcuad");
    			add_location(path0, file$6, 285, 3, 8939);
    			attr_dev(path1, "fill-rule", "evenodd");
    			attr_dev(path1, "clip-rule", "evenodd");
    			attr_dev(path1, "d", "M20.8276 15.3496C22.2774 15.3496 23.4526 14.1744 23.4526 12.7246C23.4526 11.2749 22.2774 10.0996 20.8276 10.0996C19.3779 10.0996 18.2026 11.2749 18.2026 12.7246C18.2026 14.1744 19.3779 15.3496 20.8276 15.3496Z");
    			attr_dev(path1, "stroke", "black");
    			attr_dev(path1, "stroke-width", "1.5");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-10lcuad");
    			add_location(path1, file$6, 294, 3, 9320);
    			attr_dev(path2, "fill-rule", "evenodd");
    			attr_dev(path2, "clip-rule", "evenodd");
    			attr_dev(path2, "d", "M12.2026 15.3496C13.6524 15.3496 14.8276 14.1744 14.8276 12.7246C14.8276 11.2749 13.6524 10.0996 12.2026 10.0996C10.7529 10.0996 9.57764 11.2749 9.57764 12.7246C9.57764 14.1744 10.7529 15.3496 12.2026 15.3496Z");
    			attr_dev(path2, "stroke", "black");
    			attr_dev(path2, "stroke-width", "1.5");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "class", "svelte-10lcuad");
    			add_location(path2, file$6, 303, 3, 9698);
    			attr_dev(svg, "class", "filled svelte-10lcuad");
    			attr_dev(svg, "width", "25");
    			attr_dev(svg, "height", "25");
    			attr_dev(svg, "viewBox", "0 0 25 25");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$6, 277, 2, 8804);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(277:32) ",
    		ctx
    	});

    	return block;
    }

    // (229:31) 
    function create_if_block_6(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			attr_dev(path0, "fill-rule", "evenodd");
    			attr_dev(path0, "clip-rule", "evenodd");
    			attr_dev(path0, "d", "M17.25 23.4502C20.5637 23.4502 23.25 20.7639 23.25 17.4502C23.25 14.1365 20.5637 11.4502 17.25 11.4502C13.9363 11.4502 11.25 14.1365 11.25 17.4502C11.25 20.7639 13.9363 23.4502 17.25 23.4502Z");
    			attr_dev(path0, "stroke", "black");
    			attr_dev(path0, "stroke-width", "1.5");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-10lcuad");
    			add_location(path0, file$6, 236, 3, 7536);
    			attr_dev(path1, "d", "M17.25 14.4502V20.4502");
    			attr_dev(path1, "stroke", "black");
    			attr_dev(path1, "stroke-width", "1.5");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-10lcuad");
    			add_location(path1, file$6, 245, 3, 7896);
    			attr_dev(path2, "d", "M14.25 17.4502H20.25");
    			attr_dev(path2, "stroke", "black");
    			attr_dev(path2, "stroke-width", "1.5");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "class", "svelte-10lcuad");
    			add_location(path2, file$6, 252, 3, 8039);
    			attr_dev(path3, "d", "M0.75 17.4501C0.751544 15.1835 1.89011 13.0688 3.78149 11.8197C5.67287 10.5706 8.06476 10.3536 10.15 11.2421");
    			attr_dev(path3, "stroke", "black");
    			attr_dev(path3, "stroke-width", "1.5");
    			attr_dev(path3, "stroke-linecap", "round");
    			attr_dev(path3, "stroke-linejoin", "round");
    			attr_dev(path3, "class", "svelte-10lcuad");
    			add_location(path3, file$6, 259, 3, 8180);
    			attr_dev(path4, "fill-rule", "evenodd");
    			attr_dev(path4, "clip-rule", "evenodd");
    			attr_dev(path4, "d", "M7.5 9.2002C9.77817 9.2002 11.625 7.35337 11.625 5.0752C11.625 2.79702 9.77817 0.950195 7.5 0.950195C5.22183 0.950195 3.375 2.79702 3.375 5.0752C3.375 7.35337 5.22183 9.2002 7.5 9.2002Z");
    			attr_dev(path4, "stroke", "black");
    			attr_dev(path4, "stroke-width", "1.5");
    			attr_dev(path4, "stroke-linecap", "round");
    			attr_dev(path4, "stroke-linejoin", "round");
    			attr_dev(path4, "class", "svelte-10lcuad");
    			add_location(path4, file$6, 266, 3, 8409);
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "25");
    			attr_dev(svg, "viewBox", "0 0 24 25");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-10lcuad");
    			add_location(svg, file$6, 229, 2, 7419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(229:31) ",
    		ctx
    	});

    	return block;
    }

    // (181:26) 
    function create_if_block_5(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			attr_dev(path0, "fill-rule", "evenodd");
    			attr_dev(path0, "clip-rule", "evenodd");
    			attr_dev(path0, "d", "M17.4526 21.7017H6.95264C6.12421 21.7017 5.45264 21.0301 5.45264 20.2017V6.70166H18.9526V20.2017C18.9526 21.0301 18.2811 21.7017 17.4526 21.7017Z");
    			attr_dev(path0, "stroke", "black");
    			attr_dev(path0, "stroke-width", "1.5");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-10lcuad");
    			add_location(path0, file$6, 188, 3, 6316);
    			attr_dev(path1, "d", "M9.95264 17.2017V11.2017");
    			attr_dev(path1, "stroke", "black");
    			attr_dev(path1, "stroke-width", "1.5");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-10lcuad");
    			add_location(path1, file$6, 197, 3, 6630);
    			attr_dev(path2, "d", "M14.4526 17.2017V11.2017");
    			attr_dev(path2, "stroke", "black");
    			attr_dev(path2, "stroke-width", "1.5");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "class", "svelte-10lcuad");
    			add_location(path2, file$6, 204, 3, 6775);
    			attr_dev(path3, "d", "M2.45264 6.70166H21.9526");
    			attr_dev(path3, "stroke", "black");
    			attr_dev(path3, "stroke-width", "1.5");
    			attr_dev(path3, "stroke-linecap", "round");
    			attr_dev(path3, "stroke-linejoin", "round");
    			attr_dev(path3, "class", "svelte-10lcuad");
    			add_location(path3, file$6, 211, 3, 6920);
    			attr_dev(path4, "fill-rule", "evenodd");
    			attr_dev(path4, "clip-rule", "evenodd");
    			attr_dev(path4, "d", "M14.4526 3.70166H9.95264C9.12421 3.70166 8.45264 4.37323 8.45264 5.20166V6.70166H15.9526V5.20166C15.9526 4.37323 15.2811 3.70166 14.4526 3.70166Z");
    			attr_dev(path4, "stroke", "black");
    			attr_dev(path4, "stroke-width", "1.5");
    			attr_dev(path4, "stroke-linecap", "round");
    			attr_dev(path4, "stroke-linejoin", "round");
    			attr_dev(path4, "class", "svelte-10lcuad");
    			add_location(path4, file$6, 218, 3, 7065);
    			attr_dev(svg, "width", "25");
    			attr_dev(svg, "height", "25");
    			attr_dev(svg, "viewBox", "0 0 25 25");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-10lcuad");
    			add_location(svg, file$6, 181, 2, 6199);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(181:26) ",
    		ctx
    	});

    	return block;
    }

    // (149:28) 
    function create_if_block_4(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "fill-rule", "evenodd");
    			attr_dev(path0, "clip-rule", "evenodd");
    			attr_dev(path0, "d", "M12.2006 23.9517C18.4138 23.9517 23.4506 18.9149 23.4506 12.7017C23.4506 6.48846 18.4138 1.45166 12.2006 1.45166C5.98742 1.45166 0.950623 6.48846 0.950623 12.7017C0.950623 18.9149 5.98742 23.9517 12.2006 23.9517Z");
    			attr_dev(path0, "stroke", "black");
    			attr_dev(path0, "stroke-width", "1.5");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-10lcuad");
    			add_location(path0, file$6, 156, 3, 5477);
    			attr_dev(path1, "d", "M7.70062 17.2017L16.6996 8.20166");
    			attr_dev(path1, "stroke", "black");
    			attr_dev(path1, "stroke-width", "1.5");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-10lcuad");
    			add_location(path1, file$6, 165, 3, 5858);
    			attr_dev(path2, "d", "M16.7006 17.2017L7.69965 8.20166");
    			attr_dev(path2, "stroke", "black");
    			attr_dev(path2, "stroke-width", "1.5");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "class", "svelte-10lcuad");
    			add_location(path2, file$6, 172, 3, 6011);
    			attr_dev(svg, "width", "25");
    			attr_dev(svg, "height", "25");
    			attr_dev(svg, "viewBox", "0 0 25 25");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-10lcuad");
    			add_location(svg, file$6, 149, 2, 5360);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(149:28) ",
    		ctx
    	});

    	return block;
    }

    // (124:30) 
    function create_if_block_3(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M8.22 20.1002L3.75 23.4502V18.9502H2.25C1.42157 18.9502 0.75 18.2786 0.75 17.4502V2.4502C0.75 1.62177 1.42157 0.950195 2.25 0.950195H21.75C22.5784 0.950195 23.25 1.62177 23.25 2.4502V8.4502");
    			attr_dev(path0, "stroke", "black");
    			attr_dev(path0, "stroke-width", "1.5");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-10lcuad");
    			add_location(path0, file$6, 131, 3, 4674);
    			attr_dev(path1, "fill-rule", "evenodd");
    			attr_dev(path1, "clip-rule", "evenodd");
    			attr_dev(path1, "d", "M22.63 15.0671L15 22.7001L11.25 23.4501L12 19.7001L19.63 12.0691C20.456 11.2432 21.795 11.2432 22.621 12.0691L22.63 12.0781C23.4546 12.9039 23.4546 14.2414 22.63 15.0671Z");
    			attr_dev(path1, "stroke", "black");
    			attr_dev(path1, "stroke-width", "1.5");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-10lcuad");
    			add_location(path1, file$6, 138, 3, 4984);
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "25");
    			attr_dev(svg, "viewBox", "0 0 24 25");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-10lcuad");
    			add_location(svg, file$6, 124, 2, 4557);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(124:30) ",
    		ctx
    	});

    	return block;
    }

    // (57:28) 
    function create_if_block_2$1(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let path7;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			attr_dev(path0, "fill-rule", "evenodd");
    			attr_dev(path0, "clip-rule", "evenodd");
    			attr_dev(path0, "d", "M4.285 2.44006H4.274C2.21422 2.8977 0.749008 4.72505 0.750001 6.83506V7.72506C0.750001 8.12289 0.908036 8.50442 1.18934 8.78572C1.47064 9.06703 1.85218 9.22506 2.25 9.22506H6C6.82843 9.22506 7.5 8.55349 7.5 7.72506V7.72506C7.5 6.89663 8.17157 6.22506 9 6.22506H15C15.8284 6.22506 16.5 6.89663 16.5 7.72506V7.72506C16.5 8.55349 17.1716 9.22506 18 9.22506H21.75C22.5784 9.22506 23.25 8.55349 23.25 7.72506V6.83506C23.2501 4.7258 21.7851 2.89954 19.726 2.44206H19.715C14.6191 1.45488 9.38116 1.4542 4.285 2.44006Z");
    			attr_dev(path0, "stroke", "black");
    			attr_dev(path0, "stroke-width", "1.5");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-10lcuad");
    			add_location(path0, file$6, 64, 3, 1767);
    			attr_dev(path1, "d", "M3.75 12.2251V18.2251C3.75 20.7104 5.76472 22.7251 8.25 22.7251H15.75C18.2353 22.7251 20.25 20.7104 20.25 18.2251V12.2251");
    			attr_dev(path1, "stroke", "black");
    			attr_dev(path1, "stroke-width", "1.5");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-10lcuad");
    			add_location(path1, file$6, 73, 3, 2446);
    			attr_dev(path2, "d", "M7.875 13.7251C7.66789 13.7251 7.5 13.893 7.5 14.1001C7.5 14.3072 7.66789 14.4751 7.875 14.4751C8.08211 14.4751 8.25 14.3072 8.25 14.1001C8.25 13.893 8.08211 13.7251 7.875 13.7251");
    			attr_dev(path2, "stroke", "black");
    			attr_dev(path2, "stroke-width", "1.5");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "class", "svelte-10lcuad");
    			add_location(path2, file$6, 80, 3, 2688);
    			attr_dev(path3, "d", "M12 13.7251C11.7929 13.7251 11.625 13.893 11.625 14.1001C11.625 14.3072 11.7929 14.4751 12 14.4751C12.2071 14.4751 12.375 14.3072 12.375 14.1001C12.375 13.893 12.2071 13.7251 12 13.7251");
    			attr_dev(path3, "stroke", "black");
    			attr_dev(path3, "stroke-width", "1.5");
    			attr_dev(path3, "stroke-linecap", "round");
    			attr_dev(path3, "stroke-linejoin", "round");
    			attr_dev(path3, "class", "svelte-10lcuad");
    			add_location(path3, file$6, 87, 3, 2988);
    			attr_dev(path4, "d", "M16.125 13.7251C15.9179 13.7251 15.75 13.893 15.75 14.1001C15.75 14.3072 15.9179 14.4751 16.125 14.4751C16.3321 14.4751 16.5 14.3072 16.5 14.1001C16.5 13.893 16.3321 13.7251 16.125 13.7251");
    			attr_dev(path4, "stroke", "black");
    			attr_dev(path4, "stroke-width", "1.5");
    			attr_dev(path4, "stroke-linecap", "round");
    			attr_dev(path4, "stroke-linejoin", "round");
    			attr_dev(path4, "class", "svelte-10lcuad");
    			add_location(path4, file$6, 94, 3, 3294);
    			attr_dev(path5, "d", "M7.875 17.4751C7.66789 17.4751 7.5 17.643 7.5 17.8501C7.5 18.0572 7.66789 18.2251 7.875 18.2251C8.08211 18.2251 8.25 18.0572 8.25 17.8501C8.25 17.643 8.08211 17.4751 7.875 17.4751");
    			attr_dev(path5, "stroke", "black");
    			attr_dev(path5, "stroke-width", "1.5");
    			attr_dev(path5, "stroke-linecap", "round");
    			attr_dev(path5, "stroke-linejoin", "round");
    			attr_dev(path5, "class", "svelte-10lcuad");
    			add_location(path5, file$6, 101, 3, 3603);
    			attr_dev(path6, "d", "M12 17.4751C11.7929 17.4751 11.625 17.643 11.625 17.8501C11.625 18.0572 11.7929 18.2251 12 18.2251C12.2071 18.2251 12.375 18.0572 12.375 17.8501C12.375 17.643 12.2071 17.4751 12 17.4751");
    			attr_dev(path6, "stroke", "black");
    			attr_dev(path6, "stroke-width", "1.5");
    			attr_dev(path6, "stroke-linecap", "round");
    			attr_dev(path6, "stroke-linejoin", "round");
    			attr_dev(path6, "class", "svelte-10lcuad");
    			add_location(path6, file$6, 108, 3, 3903);
    			attr_dev(path7, "d", "M16.125 17.4751C15.9179 17.4751 15.75 17.643 15.75 17.8501C15.75 18.0572 15.9179 18.2251 16.125 18.2251C16.3321 18.2251 16.5 18.0572 16.5 17.8501C16.5 17.643 16.3321 17.4751 16.125 17.4751");
    			attr_dev(path7, "stroke", "black");
    			attr_dev(path7, "stroke-width", "1.5");
    			attr_dev(path7, "stroke-linecap", "round");
    			attr_dev(path7, "stroke-linejoin", "round");
    			attr_dev(path7, "class", "svelte-10lcuad");
    			add_location(path7, file$6, 115, 3, 4209);
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "25");
    			attr_dev(svg, "viewBox", "0 0 24 25");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-10lcuad");
    			add_location(svg, file$6, 57, 2, 1650);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    			append_dev(svg, path6);
    			append_dev(svg, path7);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(57:28) ",
    		ctx
    	});

    	return block;
    }

    // (32:28) 
    function create_if_block_1$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill-rule", "evenodd");
    			attr_dev(path0, "clip-rule", "evenodd");
    			attr_dev(path0, "d", "M1.5 6.4502C1.5 5.62177 2.17157 4.9502 3 4.9502H21C21.8284 4.9502 22.5 5.62177 22.5 6.4502V18.4502C22.5 19.2786 21.8284 19.9502 21 19.9502H3C2.17157 19.9502 1.5 19.2786 1.5 18.4502V6.4502Z");
    			attr_dev(path0, "stroke", "black");
    			attr_dev(path0, "stroke-width", "1.5");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-10lcuad");
    			add_location(path0, file$6, 39, 3, 1042);
    			attr_dev(path1, "d", "M22.1609 5.50024L14.0169 11.7642C12.8278 12.679 11.172 12.679 9.98287 11.7642L1.83887 5.50024");
    			attr_dev(path1, "stroke", "black");
    			attr_dev(path1, "stroke-width", "1.5");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-10lcuad");
    			add_location(path1, file$6, 48, 3, 1399);
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "25");
    			attr_dev(svg, "viewBox", "0 0 24 25");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-10lcuad");
    			add_location(svg, file$6, 32, 2, 925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(32:28) ",
    		ctx
    	});

    	return block;
    }

    // (7:1) {#if type === 'checkmark'}
    function create_if_block$2(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M6.20264 13.9247L8.65264 17.4017C8.84119 17.6833 9.15422 17.8565 9.49301 17.8666C9.8318 17.8768 10.1546 17.7226 10.3596 17.4527L18.2026 7.52966");
    			attr_dev(path0, "stroke", "black");
    			attr_dev(path0, "stroke-width", "1.5");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-10lcuad");
    			add_location(path0, file$6, 14, 3, 243);
    			attr_dev(path1, "fill-rule", "evenodd");
    			attr_dev(path1, "clip-rule", "evenodd");
    			attr_dev(path1, "d", "M12.2026 23.9507C18.4158 23.9507 23.4526 18.9139 23.4526 12.7007C23.4526 6.48748 18.4158 1.45068 12.2026 1.45068C5.98943 1.45068 0.952637 6.48748 0.952637 12.7007C0.952637 18.9139 5.98943 23.9507 12.2026 23.9507Z");
    			attr_dev(path1, "stroke", "black");
    			attr_dev(path1, "stroke-width", "1.5");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-10lcuad");
    			add_location(path1, file$6, 21, 3, 507);
    			attr_dev(svg, "width", "16");
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "viewBox", "0 0 25 25");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-10lcuad");
    			add_location(svg, file$6, 7, 2, 126);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(7:1) {#if type === 'checkmark'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let span;
    	let span_class_value;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[0] === 'checkmark') return create_if_block$2;
    		if (/*type*/ ctx[0] === 'email') return create_if_block_1$1;
    		if (/*type*/ ctx[0] === 'phone') return create_if_block_2$1;
    		if (/*type*/ ctx[0] === 'comment') return create_if_block_3;
    		if (/*type*/ ctx[0] === 'close') return create_if_block_4;
    		if (/*type*/ ctx[0] === 'bin') return create_if_block_5;
    		if (/*type*/ ctx[0] === 'add-user') return create_if_block_6;
    		if (/*type*/ ctx[0] === 'more-menu') return create_if_block_7;
    		if (/*type*/ ctx[0] === 'linkedin') return create_if_block_8;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "class", span_class_value = "" + (null_to_empty(/*color*/ ctx[1]) + " svelte-10lcuad"));
    			attr_dev(span, "tabindex", "-1");
    			add_location(span, file$6, 5, 0, 52);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}

    			if (dirty & /*color*/ 2 && span_class_value !== (span_class_value = "" + (null_to_empty(/*color*/ ctx[1]) + " svelte-10lcuad"))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { type, color = '' } = $$props;
    	const writable_props = ['type', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ type, color });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, color, click_handler];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { type: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*type*/ ctx[0] === undefined && !('type' in props)) {
    			console.warn("<Icon> was created without expected prop 'type'");
    		}
    	}

    	get type() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Parts = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Slider: Slider,
        Switch: Switch,
        Button: Button,
        Loader: Loader,
        Avataaar: Avataaar,
        Icon: Icon
    });

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    const
    	random = (min, max, float = false) => {
    		// max can be omitted
    		float = typeof max === 'boolean' ? max : float;
    		[min, max] = max === undefined || typeof max === 'boolean'
    			// with no parameters, defaults to 0 or 1
    			? min === undefined ? [0, 2] : [0, +min]
    			: [+min, +max];
    		return float ? Math.random() * (max - min) + min : Math.floor(Math.random() * (max - min)) + min;
    	},

    	nyord = [
    		/*'2000-2013',*/
    		"atomslöjd", "biovältare", "blandkostare", "cookie", "dagshandlare", "dogmafilm", "dra ett streck i sanden", "e-bio", "e-demokrati", "e-learning", "karriärcoach", "keltisk tiger", "kompetensväxling", "mervärdesmat", "mess", "messa", "nanoteknik", "den nya ekonomin", "plötslig vuxendöd", "portfoliometoden", "rocka fett", "sexslavhandel", "trafficking", "SMS-meddelande", "transperson", "vinstvarning", "öråd", "apfälla", "asymmetrisk krigföring", "betårta", "bin Ladin-rabatt", "bioterrorism", "fickla", "hembränd", "homoadoption", "Ikeamonarki", "julgranssyndrom", "koldioxidsänka", "kravallant", "kravallturism", "Lasse Berghagen-vin", "Maudeffekten", "mobilblottare", "napptermometer", "pensionärskuvös", "personlig", "pulverbrev", "reklejma", "resultatvarna", "skurkstat", "sprejgodis", "stafettläkare", "talibanisering", "taliban-tv", "terapeutisk kloning", "tok", /*"tok-",*/ "utsimningsbassäng", "viagra", "zebralagen", "24-timmarsmyndighet", "blixad", "bokstav", "distansbatong", "efterföljarskap", "frontbibliotekarie", "förnamn", "galna chips-sjukan", "göra en pudel", "hjulboja", "härgjord", "kemkastrering", "kis", "kostymrasist", "kuratera", "mms", "morbidturism", "nätdeklarant", "orostelefon", "pappografi", "ryggsäcksmodellen", "skimma", "snippa", "snurrmästare", "sprängbälte", "svenna sitt liv", "uckig", "valstuga", "vilopension", "vindvändare", "vinterkräksjuka", "vittneslitteratur", "anime", "attitydig", "babybio", "grönt elcertifikat", "finansfobi", "flitbonus", "närvaropeng", "förarstödjare", "förlåtande", "glokal", "googla", "halvpudel", "inbäddad journalist", "kameratelefon", "kreativ skolgång", "göra en labrador", "ljudöra", "lådvinsalkoholism", "lätthelg", "manga", "modemkapare", "pompekunskap", "promotiv", "sars", "social turism", "spår", "stalker", "svennekoloni", "svennefiera", "taikonaut", "talpenna", "temakonfirmation", "tidsfönster", "trekvartspudel", "tröskelboende", "äga frågan", "backflyt", "backslick", "biomal", "blingbling", "blogg", "bokstavsdrog", "brattig", "curlingförälder", "datalektiker", "fashionista", "flexitarian", "fronta", "förlåtandeintervall", "garanterad traditionell specialitet", "gångfartsgata", "gångpeng", "hbt", "hjärtstartare", "homokompetens", "instegsjobb", "kotlettfrilla", "krana", "kyrktrappsbröllop", "köttberg", "lokator", "luvunge", "mansskatt", "metrosexualitet", "mms:a", "mp3-spelare", "nånannanism", "polyamori", "romkom", "rugbyförälder", "rutavdrag", "röstsamtal", "servicebarn", "smygöppna", "soldusch", "spermatvätt", "studsmattesjuka", "topsa", "videosamtal", "vuxenvälling", "örådisera", "alkobom", "barriärvård", "blinga", "blogga", "bloggare", "blåljusyrke", "digitalbox", "digital-tv", "elgasbil", "estetisk kompetens", "flyttstajla", "gala in", "gardinhängarjobb", "glaskulefolket", "gonnabe", "hedersvåld", "hotelljournalist", "id-sprej", "industrisafari", "ip-tv", "kollektomat", "koscheria", "kreddig", "krisväska", "kungspudel", "miltonpengar", "mobilmobbning", "menskopp", "mobil klubb", "mobilvirus", "musikmobil", "nätfiske", "nätbingo", "nätpoker", "paltkoma", "pixlig", "platt-tv", "plusjobb", "plötslig sportbarnsdöd", "podda", "poddradio", "poddsändning", "pärlifiera", "smartball", "snackis", "snålsurfa", "spim", "stjärtfluss", "stödkorv", "sudoku", "sugrörsseende", "tjock-tv", "transponder", "trängselskatt", "tvillingshoppare", "vara på tårna", "vägg-tv", "andrafiering", "betalblogg", "blattesvenska", "bloggosfär", "bröllopskoordinator", "buda", "bötning", "curla", "cykelbox", "drevkultur", "FAR", "fjärrnyckel", "flexicurity", "flexidaritet", "friva", "fulbryt", "genuspedagog", "genuskänslig", "geocaching", "groma", "hejaklacksjournalistik", "helikoptermamma", "hemmadagis", "IVPA", "Kalle Anka-logistik", "klimatflykting", "latteliberal", "legga", "medborgarjournalistik", "miljonsvenska", "minnespinne", "minnesprick", "mobilstrumpa", "mobil-tv", "nystartsjobb", "Odellplatta", "prio", "receptmotionär", "regnbågsbarn", "regnbågskväll", "rondellhund", "safariforskning", "shoppingspion", "sopspanare", "sovbutik", "stadsspret", "stadsutglesning", "stadsutglesning", "sverka", "timellare", "tjejkött", "triage", "villamatta", "vårdotek", "vårdvisare", "äldrelots", "agflation", "ankarbarn", "barista", "betalvärd", "blåkort", "dampa", "entourage", "Foppatoffel", "förortare", "givomat", "vandrande skolbuss", "gåtåg", "halvtaktsjobb", "interaktiv skrivtavla", "jobbtorg", "klimathot", "klimatlarm", "klimatmat", "klimatneutral", "klimatsmart", "klimatsäkra", "klimatvänlig", "klimatångest", "koldioxidbanta", "kristofobi", "kubtest", "kulturkofta", "livspussel", "munhota", "nixa", "nyfriskjobb", "nyhetsbok", "näthat", "passivhus", "pimpa", "rallylydnad", "reinfeldtare", "skajpa", "smartboard", "transfett", "tävla ut", "wiki", "vintage", "zorra", "ADV", "ansiktsspårning", "bekymringssamtal", "bilmålvakt", "bloggbävning", "blåstråle", "bullerbysyndromet", "burkini", "celebritariat", "finanssmälta", "förväntningssamhälle", "gatustickning", "geotaggning", "kalsongbadare", "klimatism", "kosläpp", "kringmyndighet", "kroppsskanning", "kuddbok", "laddhybrid", "ljudaffisch", "mikroblogg", "minidator", "mobillångfilm", "plastis", "plutoid", "skynka", "svenskad", "säg", "ödleplåster", "alfanummer", "bilsurfa", "chefsnappning", "chippa", "fiskpedikyr", "frimester", "fröbomba", "fuldelning", "följare", "grindstad", "gågging", "hemester", "könskonträr", "laddstolpe", "mobilroman", "norsk karaoke", "oresebyrå", "prokotta", "sitskate", "slidkrans spikmatta", "sporta", "sprita", "stjärnfamilj", "stuprörspolitik", "svemester", "svininfluensa", "twittra", "yrkessåpa", "app", "askbränd", "askstoppad", "asktåg", "askänka", "bjästa", "bloppa", "bloppis", "bästsäljerism", "cykelbarometer", "danseoke", "facebooka", "Facebookfest", "filvärd", "grafen", "guldomat", "guldsot", "inaskad", "jobbstopparpolitik", "kaffeflicka", "kalkstenssångare", "kalsongbombare", "koldioxidneutralt vin", "kringtidskort", "kylkrage", "kärlekslås", "köttklister", "morotsaktivism", "morotsmobb", "näringslots", "ordningskonsult", "plånboksbröllop", "processturism", "rit-avdrag", "räddningskort", "sanningsbarometer", "serieskytt", "solflygteknik", "solhybrid", "spotifiera", "språkekonomi", "stupstockspolitik", "tobleronepolitik", "valpromenera", "wikiläcka", "vulkanresa", "vuvuzela", "väggord", "ångerrösta", "ac-förkylning", "airbaghjälm", "appa", "arabisk vår", "attitydinkontinens", "Bamseteorem", "brorsantrick", "brännskräp", "bröllopsklänning", "börsrobot", "dumpling", "döda vinkeln-varnare", "fastlans", "fixie", "flipperförälder", "foliehatt", "framåtlutad", "fulparkerare", "förlåtturné", "förväntis", "gps-väst", "jasminmöte", "jasminrevolution", "juholtare", "kapselbryggare", "kawaii", "knarkometer", "knytkonferens", "koka böcker", "loba", "lunchdisco", "lyssna in", "matkasse", "missmatchning", "mobildagis", "molekylärgastronomi", "möbelhund", "möpare", "novellix", "nysare", "ofast jobb", "otrohetsdejting", "padda", "plankning", "post-it-krig", "prehab", "restdejting", "retronym", "robothandel", "seismisk", "skräpbot", "skämsfilter", "slöjböter", "sms-livräddare", "surdegshotell", "säpojogg", "tasigförsamhet", "terja", "tjejsamla", "tonårsskrämma", "trollfilter", "trädmord", "uggling", "vattkoppsgodis", "vobba", "åsiktstaliban", "brony", "conversesjukan", "drinkorexi", "emoji", "eurobävning", "fysisk cd", "grexit", "hackathon", "henifiera", "hubot", "klämspärr", "kopimism", "kramtjuv", "köttrymden", "livslogga", "läshund", "matbil", "memil", "mjuk betalvägg", "mossgraffiti", "märk-dna", "nomofobi", "ogooglebar", "mobilvantar", "petabyte", "queerpolska", "robotdräkt", "robotfälla", "ryggplankning", "räckviddsångest", "spelifiera", "spårtjuv", "ståhjuling", "Tintingate", "tårtgate", "utvigning", "visukal", "zlatanera", "överklassafari", "5:2-diet", "betalskugga", "bjudkaffe", "brexit", "budgetstup", "carpa", "dygnis", "e-cigarett", "embrejsa", "enveckasförsvar", "e-sport", "funktionell dumhet", "fäbodifiering", "global hektar", "gubbploga", "hikikomori", "hypa", "hämndporr", "hästlasagne", "kjolprotest", "klicktivism", "köttskatt", "linjär tv", "läxrut", "löpsedelsteater", "mobilmissbruk", "nagelprotest", "nätvandra", "otrohetskontroll", "rutkod", "satsig", "selfie", "sextremism", "smartplåster", "snippgympa", "spökgarn", "torggängare", "tvåhandsbeslut", "twerka", "utsmarta",
    		/*'2014',*/
    		'attefallshus', 'blåbrun', 'cisperson', 'digital valuta', 'en', 'fotobomba', 'frisparkssprej', 'genusbudgetering', 'gurlesk', 'gäri', 'icke-binär', 'kippavandring', 'klickfiske', 'krislåda', 'kärrtorpa', 'köttnorm', 'matnationalism', 'mellanförskap', 'mobilzombie', 'nerväxt', 'nettokrati', 'normcore', 'parkera bussen', 'plastbanta', 'pultvätta', 'rasifierad', 'ryggprotest', 'rödgrönrosa', 'sekelsiffror', 'selfiepinne', 'sms-anställning', 'spoilervarning', 'trafikmaktordning', 'tvodd', 'tvåkönsnorm', 'usie', 'virtuell våldtäkt', 'yoloa', 'åsiktskorridor',
    		/*'2015',*/
    		'avinvestera', 'cosplay', 'delningsekonomi', 'douche', 'dumpstra', 'EU-migrant', 'faktaresistens', 'funkis', 'geoblockering', 'groupie', 'haffa', 'halmdocka', 'klickokrati', 'klittra', 'kulturell appropriering', 'mansplaining', 'naturvin', 'nyhetsundvikare', 'obror', 'plattfilm', 'rattsurfa', 'robotjournalistik', 'självradikalisering', 'skuldkvotstak', 'ståpaddling', 'svajpa', 'svischa', 'talepunkt', 'terrorresa', 'transitflykting', 'triggervarning', 'trollfabrik', 'vejpa', 'vithetsnorm', 'värdgraviditet', 'youtuber', 'ögonkramp',
    		/*'2016',*/
    		'annonsblockerare', 'blippbetalning', 'kontaktlös kortbetalning', 'blåljuspersonal', 'cirkulär ekonomi', 'det mörka nätet', 'Dylanman', 'egenanställningsföretag', 'ekodukt', 'enkortsdator', 'filterbubbla', 'fomo', 'fredsring', 'frågestrejka', 'förpackningsfri', 'förstärkt verklighet', 'ghosta', 'gigekonomi', 'grindsamhälle', 'influerare', 'kompetenstrappa', 'korsspråkande', 'kroppsaktivism', 'lånegarderob', 'läslov', 'matsvinnsbutik', 'medborgarforskning', 'mukbang', 'paddeltennis', 'pappafeminist', 'parasport', 'poke', 'pokenad', 'preppare', 'proteinskifte', 'samlarsyndrom', 'skamma', 'ställa frågor', 'trumpifiering', 'uberisering', 'utpressningsprogram', 'vuxenmålarbok', 'växtmjölk', 'äggkonto',
    		/*'2017',*/
    		'alternativa fakta', 'blockkedja', 'blorange', 'bonus malus', 'cringe', 'dabba', 'direktare', 'doxa', 'döstäda', 'expresskidnappning', 'fejkade nyheter', 'fidget spinner', 'framtidsfullmakt', 'funktionsrätt', 'grit', 'halalturism', 'hyberavdrag', 'inrymning', 'killgissa', 'klickfarm', 'knäprotest', 'kombucha', 'kompetensutvisning', '#metoo', 'omakase', 'pansexuell', 'plogga', 'poddtaxi', 'postfaktisk', 'rekoring', 'renovräkning', 'sekundärkränkt', 'serieotrohet', 'skogsbad', 'snubbelsten', 'spetspatient', 'veganisera', 'viralgranska',
    		/*'2018',*/
    		'aquafaba', 'beslutsblindhet', 'bokashi', 'cyberhygien', 'digifysisk', 'dm:a', 'e-krona', 'explainer', 'flossa', 'flygskam', 'förpappring', 'gal–tan–skala', 'gensax', 'incel', 'intryckssanera', 'lårskav', 'mandatpingis', 'menscertifiera', 'mikrootrohet', 'nollavfall', 'någonstansare ', 'varsomhelstare', 'nätläkare', 'pyramidmatta', 'självoptimering', 'språkplikt', 'spårpixel', 'stöddjur', 'swishjournalist', 'techlash', 'VAR', 'välfärdsbrott', 'whataboutism',
    		/*'2019',*/
    		'animoji', 'antivaxxare', 'artdöden', 'ASMR', 'aspludd', 'benim', 'beteendedesign', 'cybersoldat', 'deepfake', 'deplattformering', 'digital tvilling', 'dra åt helvete-kapital', 'eldost', 'fimpomat', 'Gretaeffekten', 'grönt körfält', 'hjärtslagslag', 'hundvissla', 'hybridkrig', 'ikigai', 'immersiv', 'klimatdiktatur', 'klimatnödläge', 'klimatstrejk', 'källtillit', 'lågaffektivt bemötande', 'menskonst', 'nattborgmästare', 'popcornhjärna', 'sharenting', 'smygflyga', 'syssna', 'tågskryta', 'växtbaserat kött', 'övervakningsekonomi',
    		/* 2020 */
    		'becknarväska', 'bolundare', 'boomer', 'cancelkultur', 'cirkulent', 'cli-fi', 'coronaanpassa', 'coronahälsning', 'covid-19', 'förnedringsrån', 'hobbyepidemiolog', 'hungerpandemi', 'hälsolitteracitet', 'immunitetspass', 'infodemi', 'intimitetskoordinator', 'kamikazetips', 'kanskeman', 'kemsex', 'klustersmitta', 'krympflation', 'lesserwisser', 'lockdown', 'mjuta', 'novent', 'platta till kurvan', 'R-tal', 'simp', 'självkarantän', 'social distansering', 'statyprotest', 'superspridare', 'turistkorridor', 'tvåmetersregeln', 'underturism', 'vårdskuld', 'växtblindhet', 'zombiebrand', 'Zoombombning',
    	],

    	buzz = [
    		"Adwords", "app", "applikation", "avvisningsfrekvens", "branded content", "content manager, content editor", "content marketing", "content provider", "cookie", "feed", "flöde", "hashtag", "hootSuite", "inbound marketing", "konvertering", "likes", "gillamarkeringar", "linkedIn", "metataggar", "nyckelord", "outbound marketing", "Periscope", "Pinterest", "podda", "regramma", "retweeta", "SEM", "SEO", "SERP", "smarketing", "SMM", "Snapchat", "social selling", "storytelling", "unika besökare", "UX", "micro-moments", "omni-channel", "blockchain", "geofencing", "brand safety", "user-generated content", "smart content", "attribution", "SISP", "inkubator", "science park", "accelerator", "coworking space", "co-creation", "cirkulär ekonomi", "cirkulära affärsmodeller", "forskningsinstitut", "hackathon", "facilitera", "innovation", "innovatör", "innovationsprocess", "öppen innovation", "inbound innovation", "innovationsmiljö", "innovationsstödssystem", "innovationssystem", "innovationsekosystem", "innovationshöjd", "investering", "investeringsfrämjande", "innovationskontor", "kluster", "scale-up", "startup", "SME", "SMF", "soft landing", "talangattraktion", "testbädd", "tillväxtföretag", "triple helix", "uppfinnare", "multi helix", "artificiell intelligens", "AI", "GPT-3", "DALL·E", "athleisure", "augmented reality", "autonoma fordon", "B2B", "B2C", "metadata", "big data", "blockchain", "BOPIS", "bricks and clicks", "chatbots", "cirkulär handel", "click & collect", "conscious consumerism", "conversational commerce", "CX", "computer vison", "digitala assistenter", "disruptiv handel", "drop shipping", "endless aisles", "facial recognition", "friktionsfri handel", "fulfillment", "fygital handel", "gamification", "green retailing", "internet of things", "kassalösa butiker", "kuraterat", "last mile", "marknadsplatser", "maskininlärning", "mobile checkout", "micro fulfillment center", "new retail", "omniexperience", "personalisering", "prime now", "pure players", "retailtainment", "RFID", "robot retail", "ROPO", "same day delivery", "see now buy now", "sensorteknik", "skills", "transparens", "visual search", "voice commerce", "relaterade artiklar", "kreativ", "ansvarsfull", "analytisk", "positiv", "motiverad", "bred erfarenhet", "omfattande erfarenhet", "organisatorisk", "effektiv", "track record", "vertikal", "disruptive", "white label", "lean startup", "pivot", "USP", "growth hacking", "bootstrapping", "MVP", "exekvera", "unicorn",
    	],

    	löremIpsum = (
    		{
    			numberOfParagraphs = 1,
    			sentencesPerParagraph = 10,
    			maxSentenceLength = 10,
    			minSentenceLength = 1,
    			isHeadline = false,
    			isName = false,
    			nyordFrequency = .1,
    			neologismerFrequency = .05,
    			namnFrequency = 0,
    			buzzFrequency = 0,
    			useLörem = true,
    			punchline = 'Du kan vara drabbad.',
    			wrapInDiv = false,
    			paragraphStartWrap = '<p>',
    			paragraphEndWrap = '</p>',
    			alwaysWrapParagraph = false
    		} = {}
    	) => {
    		let
    			k = 'bdfghjklmnprstv',
    			v = 'aouåeiyäö',
    			pre = [
    				'a', 'a', 'a', 'ana', 'ante', 'anti', 'astro', 'auto', 'be', 'be', 'be', 'be', 'bi', 'bio', 'de', 'deka', 'deci', 'di', 'di', 'di', 'dia', 'ego', 'epi', 'euro', 'e', 'exo', 'eu', 'geo', 'giga', 'hemi', 'hetero', 'hexa', 'homo', 'hypo', 'i', 'infra', 'intra', 'ko', 'kontra', 'kro', 'kvasi', 'makro', 'ma', 'mega', 'mikro', 'mono', 'multi', 'o', 'o', 'o', 'o', 'o', 'o', 'para', 'pa', 'pe', 'poly', 'po', 'pre', 'pre', 'pre', 'pro', 'pseudo', 're', 'rea', 're', 'semi', 'steno', 'su', 'supra', 'sy', 'tele', 'tera', 'tetra', 'tra', 'tri', 'ultra',
    			],
    			mid = [
    				'do', 're', 'mi', 'fa', 'so', 'la', 'ti', 'ne', 'de', 'se', 'kro', 'pla', 'pre', 'tre', 'di', 'va', 'sa', 'po', 'ka', 'spe', 'vi', 'ni', 'be', 'te', 'ny',
    			],
    			suf = [
    				'sa', 'na', 'ra', 'da', 'sat', 'nat', 'rat', 'dat', 'sade', 'nade', 'rade', 'dade', 't', 'ss', 's', 'ck', 'pp', 'n', 'n', 'n', 'n', 'n', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'ssa', 'tt', 'st', 'st', 'nt', 'ren', 'de', 'de', 'de', 'de', 'se', 'nera', 'ning', 'ning', 'sade', 'ssade', 'rade', 'rad', 'ktig', 'rtad', 'sm', 'ledes', 'skap', 'skapet', 'l', 'l', 'l', 'ns', 'ktig', 'ktigt', 'ktiga', 'll', 'ns', 'gon', 'gen', 'het', 'heten', 'bel', 'bel', 'belt', 'd', 'k', 'ng', 'ngen', 's', 's', 's', 'sk', 'sk', 'sk', 'ska', 'ska', 'skade', 'sm', 'v', 'v', 'v', 'ligen', 'logi', 'gisk', 'ment', 'sam', 'samma', 'vis', 'vis', 'vis', 'vis', 'gt', 'gt', 'gt', 'lig', 'lig', 'lig', 'liga', 'liga', 'ligt', 'ligt', 'ra', 'rar', 'rade', 'ras', 'rat', 'na', 'nar', 'nade', 'nas', 'nat', 'nde', 'nde', 'nde', 're', 're', 'ren', 'ling', 'lingar', 'ling', 'ng', 'ngar', 'ngen',
    			],
    			konj = [
    				'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'och', 'och', 'och', 'och', 'och', 'och', 'och', 'och', 'och', 'och', 'att', 'att', 'att', 'att', 'det', 'en', 'på', 'är', 'som', 'för', 'med', 'har', 'av', 'till', 'den', 'inte', 'inte', 'inte', 'inte', 'de', 'om', 'ett', 'jag', 'men',

    				'samt', 'såväl som', 'respektive', 'plus', 'inklusive', 'eller', 'men', 'fast', 'utan', 'utom', 'förutom', 'för', 'så', 'det vill säga', 'alltså', 'att', 'som', 'om', 'än', 'om', 'ifall', 'huruvida', 'än', 'liksom', 'såsom', 'eftersom', 'därför att', 'för att', 'då', 'emedan', 'fast', 'fastän', 'oaktat', 'om än', 'även om', 'för att', 'om', 'ifall', 'då', 'när', 'medan', 'sedan', 'innan', 'till', 'tills'
    			],
    			akademiska = {
    				prefix: ['ab', 'agnosti', 'andro', 'ana', 'ambi', 'anti', 'antropo', 'apo', 'astro', 'bi', 'bio', 'cyn', 'de', 'des', 'demi', 'demo', 'dia', 'dys', 'eko', 'elektro', 'em', 'en', 'endo', 'epi', 'etno', 'filo', 'fono', 'foto', 'hetero', 'hyper', 'kom', 'kon', 'kontra', 'kvasi', 'logo', 'medel', 'mega', 'meta', 'metro', 'mikro', 'miso', 'mono', 'myto', 'neo', 'onto', 'opera', 'pan', 'para', 'per', 'pneuma', 'poli', 'poly', 'post', 'pre', 'prima', 'pro', 'pseudo', 'psyko', 'radio', 're', 'rea', 'semi', 'stereo', 'supra', 'syn', 'te', 'tele', 'tempo', 'tera', 'terra', 'teo', 'termo', 'trans', 'tri'],
    				suffix: ['aktiv', 'bel', 'centrism', 'cism', 'ception', 'diktisk', 'faktisk', 'fas', 'fiering', 'fili', 'foni', 'form', 'gam', 'gen', 'graf', 'gram', 'gyn', 'ism', 'itet', 'kemi', 'krati', 'log', 'logi', 'mani', 'matisk', 'meter', 'modern', 'netik', 'nomi', 'osmos', 'patologi', 'plastisk', 'pod', 'pol', 'siv', 'sion', 'skop', 'social', 'sofi', 'stat', 'stik', 'tes', 'tet', 'tik', 'tion', 'tism', 'tiv', 'tologi', 'topi', 'tropi', 'tos', 'total', 'tris', 'typ', 'valens', 'vision']
    			},
    			namn = {
    				k: ["Maria", "Anna", "Margareta", "Elisabeth", "Eva", "Kristina", "Birgitta", "Karin", "Marie", "Elisabet", "Ingrid", "Christina", "Sofia", "Linnéa", "Kerstin", "Lena", "Helena", "Marianne", "Emma", "Linnea", "Johanna", "Inger", "Sara", "Cecilia", "Elin", "Anita", "Louise", "Ida", "Linda", "Gunilla", "Ulla", "Susanne", "Hanna", "Viola", "Malin", "Katarina", "Jenny", "Carina", "Elsa", "Monica", "Astrid", "Irene", "Ulrika", "Alice", "Julia", "Annika", "Viktoria", "Barbro", "Åsa", "Amanda", "Matilda", "Therese", "Camilla", "Ann", "Siv", "Yvonne", "Lovisa", "Agneta", "Britt", "Caroline", "Lisa", "Ingegerd", "Charlotte", "Sandra", "Frida", "Sofie", "Anette", "Gun", "Emelie", "Margaretha", "Ebba", "Emilia", "Ellen", "Alexandra", "Berit", "Victoria", "Erika", "Charlotta", "Jessica", "Anneli", "Maja", "Inga", "Olivia", "Agnes", "Märta", "Pia", "Madeleine", "Ingeborg", "Mona", "Felicia", "Ella", "Gunnel", "Josefin", "Sonja", "Karolina", "Birgit", "Lina", "Magdalena", "Signe", "Helen"],

    				m: ["Erik", "Lars", "Karl", "Anders", "Johan", "Per", "Nils", "Carl", "Mikael", "Jan", "Hans", "Peter", "Olof", "Lennart", "Gunnar", "Sven", "Fredrik", "Daniel", "Bengt", "Bo", "Alexander", "Gustav", "Göran", "Åke", "Magnus", "Martin", "Andreas", "Stefan", "John", "Mats", "Leif", "Ulf", "Thomas", "Björn", "Henrik", "Jonas", "Axel", "Christer", "Bertil", "Robert", "Arne", "David", "Emil", "Ingemar", "Håkan", "Kjell", "Stig", "Mattias", "Rolf", "William", "Oskar", "Tommy", "Roland", "Michael", "Patrik", "Simon", "Joakim", "Christian", "Oscar", "Marcus", "Sebastian", "Anton", "Roger", "Gustaf", "Ingvar", "Eric", "Tomas", "Olov", "Viktor", "Johannes", "Tobias", "Hugo", "Niklas", "Elias", "Kent", "Adam", "Ove", "Emanuel", "Robin", "Jörgen", "Filip", "Ali", "Rune", "Kenneth", "Gösta", "Wilhelm", "Linus", "Arvid", "Albin", "Jonathan", "Dan", "Sten", "Kurt", "Oliver", "Olle", "Rickard", "Alf", "Claes", "Vilhelm", "Henry"],

    				e: ["Andersson", "Johansson", "Karlsson", "Nilsson", "Eriksson", "Larsson", "Olsson", "Persson", "Svensson", "Gustafsson", "Pettersson", "Jonsson", "Jansson", "Hansson", "Bengtsson", "Carlsson", "Jönsson", "Lindberg", "Petersson", "Magnusson", "Lindström", "Gustavsson", "Olofsson", "Lindgren", "Axelsson", "Bergström", "Lundberg", "Lundgren", "Berg", "Jakobsson", "Berglund", "Sandberg", "Fredriksson", "Mattsson", "Sjöberg", "Forsberg", "Henriksson", "Lindqvist", "Lind", "Engström", "Eklund", "Lundin", "Danielsson", "Ali", "Håkansson", "Holm", "Gunnarsson", "Bergman", "Samuelsson", "Fransson", "Nyström", "Lundqvist", "Björk", "Holmberg", "Wallin", "Johnsson", "Arvidsson", "Söderberg", "Nyberg", "Isaksson", "Nordström", "Mårtensson", "Lundström", "Björklund", "Eliasson", "Berggren", "Ahmed", "Sandström", "Nordin", "Ström", "Åberg", "Ekström", "Hermansson", "Holmgren", "Hedlund", "Sundberg", "Sjögren", "Dahlberg", "Mohamed", "Martinsson", "Öberg", "Hellström", "Strömberg", "Månsson", "Blom", "Ek", "Abrahamsson", "Falk", "Blomqvist", "Norberg", "Åkesson", "Lindholm", "Sundström", "Löfgren", "Åström", "Jonasson", "Dahl", "Söderström", "Jensen", "Andreasson"]
    			},

    			neologismer = (o => o.prefix.flatMap(p => o.suffix.map(s => p + s)))(akademiska),

    			getName = () => `${random() ? namn.k[random(100)] : namn.m[random(100)]} ${namn.e[random(100)]}`,

    			getWord = () => {
    				return Math.random() < nyordFrequency ?
    					nyord[random(nyord.length)] :
    					Math.random() < neologismerFrequency ?
    						neologismer[random(neologismer.length)] :
    						Math.random() < buzzFrequency ?
    							buzz[random(buzz.length)] :
    							Math.random() < namnFrequency ?
    								getName() :
    								pre[random(pre.length)] +
    								(random(5) ? '' : mid[random(mid.length)]) +
    								(random(10) ? '' : mid[random(mid.length)]) +
    								(random(15) ? '' : mid[random(mid.length)]) +
    								suf[random(suf.length)];
    			},

    			getSentence = () => {
    				let max = random(minSentenceLength, maxSentenceLength + 1),
    					s = '';
    				// reduce probability of one word sentences (but not 0)
    				max = max < 2 ? random(minSentenceLength, maxSentenceLength + 1) : max;

    				for (let n of Array(max)) {
    					s += getWord();

    					// add commas or colons
    					s += n > 0 && n < max - 1 && !random(6) ? (random(8) ? ', ' : ': ') : ' ';

    					// add conjunctions
    					if (n > 0 && n < max - 1) s += random(3) ? '' : konj[random(konj.length)] + ' ';
    				}

    				// Make it a sentence
    				return s.slice(0, 1).toUpperCase() + s.slice(1, -1) + (isHeadline ? '' : '. ');
    			},

    			getParagraph = () => {
    				let p = '';

    				if (isName) p += getName();
    				else {
    					for (let i of Array(sentencesPerParagraph))
    						p += getSentence();

    					// add punchline
    					if (maxSentenceLength > 3)
    						p += random(15) ? '' : (isHeadline ? '. ' + punchline + '' : punchline + ' ');
    				}

    				// wrap if more than one paragraphs
    				return wrapWithP ? paragraphStartWrap + p + paragraphEndWrap : p;
    			},

    			wrapWithP = numberOfParagraphs > 1 || alwaysWrapParagraph,
    			lörem = 'Lörem ipsum ',
    			// add random syllables for variation
    			syllables = Array(50).fill(0).map(() => k[random(k.length)] + v[random(v.length)]),
    			s = '';

    		if (isName) useLörem = false;

    		// add mid thrice so as not to sound too pompous.
    		pre = [...pre, ...syllables, ...v.split(''), ...mid, ...mid, ...mid];
    		mid = [...mid, ...syllables];

    		// get pragraphs
    		for (let i of Array(numberOfParagraphs))
    			s += getParagraph();

    		// add lörem
    		if (useLörem && maxSentenceLength > 3)
    			s = wrapWithP ?
    				s.slice(0, paragraphStartWrap.length) + lörem +
    				s.slice(paragraphStartWrap.length, paragraphStartWrap.length + 1).toLowerCase() +
    				s.slice(paragraphStartWrap.length + 1)
    				:
    				lörem + s.slice(0, 1).toLowerCase() + s.slice(1);

    		// optional wrap
    		return wrapInDiv ? '<div>' + s + '</div>' : s;
    	};

    const words = {
    	"adjective1": [
    		"Key",
    		"Main",
    		"Chief",
    		"Head",
    		"", "", "", "", "", ""
    	],
    	"adjective2": [
    		"Executive",
    		"Senior",
    		"Regional",
    		"Associate",
    		"Head",
    		"Global",
    		"Independent",
    		"",
    		"Division",
    		"National",
    		"Creative",
    		"Dedicated",
    		"Operations",
    		"Area",
    		"Licenced",
    		"Retail",
    		"Office",
    		"Industrial",
    		"International",
    		"Deputy"
    	],
    	"adjective3": [
    		"Executive",
    		"Development",
    		"Technical",
    		"Business",
    		"Financial",
    		"IT",
    		"Project",
    		"Cost",
    		"Managing",
    		"Commercial",
    		"Procurement",
    		"Team",
    		"Real Estate",
    		"Sales",
    		"Property",
    		"Asset",
    		"Facility",
    		"Creative",
    		"Operation",
    		"Enterprise",
    		"Corporate",
    		"Green Building",
    		"Construction",
    		"Marketing",
    		"Investment",
    		"Customer",
    		"Reconciliation",
    		"Master",
    		"Safety",
    		"Process",
    		"Research",
    		"Leasing",
    		"Strategy",
    		"Planning",
    		"Due Diligence",
    		"Loan",
    		"Risk",
    		"Valuations",
    		"Insurance",
    		"Debt",
    		"Portfolio",
    		"Acquisitions",
    		"Performance",
    		"Economic",
    		"Tax",
    		"HR",
    		"Hospitality",
    		"Residential",
    		"Infrastructure",
    		"F&B"
    	],
    	"position": [
    		"Director",
    		"Manager",
    		"Architect",
    		"Representative",
    		"Specialist",
    		"President",
    		"Vice-president",
    		"Partner",
    		"Engineer",
    		"Officer",
    		"Analyst",
    		"Consultant",
    		"Advisory",
    		"Supervisor",
    		"Executive",
    		"Agent",
    		"Economist",
    		"Controller",
    		"Counsel",
    		"Researcher",
    	]
    };

    const title = () => `${words.adjective1[random$1(words.adjective1.length)]} ${words.adjective2[random$1(words.adjective2.length)]} ${words.adjective3[random$1(words.adjective3.length)]} ${words.position[random$1(words.position.length)]}`;

    const suffix = [
    	"Association",
    	"Co.",
    	"AG",
    	"AB",
    	'Group',
    	"Corporation",
    	"Corp.",
    	"Foundation",
    	"Fund",
    	"Incorporated",
    	"Inc.",
    	"Institute",
    	"Ltd.",
    	"Society",
    	"Syndicate",
    	"Union",
    	"LLC"
    ];

    const corporation = () => `${löremIpsum({
	maxSentenceLength: 2,
	sentencesPerParagraph: 1,
	isHeadline: true,
	buzzFrequency: .5,
	useLörem: false,
	punchline: '',
})} ${suffix[random$1(suffix.length)]}`
    	.replace(
    		/[\wåäöÅÄÖ]\S*/g,
    		function (txt) {
    			return txt.charAt(0).toUpperCase() + txt.substr(1);
    		}
    	);

    /* src/parts/Tooltip.svelte generated by Svelte v3.44.1 */
    const file$5 = "src/parts/Tooltip.svelte";

    // (18:0) {#if on}
    function create_if_block$1(ctx) {
    	let div;
    	let t0;
    	let svg;
    	let path;
    	let t1;
    	let div_class_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	let if_block0 = (/*pos*/ ctx[1] == 'top' || /*pos*/ ctx[1] == 'left') && create_if_block_2(ctx);
    	let if_block1 = (/*pos*/ ctx[1] == 'bottom' || /*pos*/ ctx[1] == 'right' || /*pos*/ ctx[1] == 'follow') && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(path, "d", "M4.58579 3.58579L1.58579 0.585786C1.21071 0.210714 0.702006 0 0.171573 0H11.8284C11.298 0 10.7893 0.210713 10.4142 0.585786L7.41421 3.58579C6.63316 4.36684 5.36684 4.36684 4.58579 3.58579Z");
    			add_location(path, file$5, 23, 3, 458);
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "viewBox", "0 0 12 12");
    			attr_dev(svg, "class", "svelte-14rlmtf");
    			add_location(svg, file$5, 22, 2, 406);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*pos*/ ctx[1]) + " svelte-14rlmtf"));
    			attr_dev(div, "style", /*followMouse*/ ctx[4]);
    			add_location(div, file$5, 18, 1, 245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*pos*/ ctx[1] == 'top' || /*pos*/ ctx[1] == 'left') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*pos*/ ctx[1] == 'bottom' || /*pos*/ ctx[1] == 'right' || /*pos*/ ctx[1] == 'follow') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*pos*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(/*pos*/ ctx[1]) + " svelte-14rlmtf"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*followMouse*/ 16) {
    				attr_dev(div, "style", /*followMouse*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fly, { y: 4, delay: /*delay*/ ctx[2] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fly, { y: 4 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(18:0) {#if on}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#if pos == 'top' || pos == 'left'}
    function create_if_block_2(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(span, "class", "svelte-14rlmtf");
    			add_location(span, file$5, 20, 3, 375);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(20:2) {#if pos == 'top' || pos == 'left'}",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#if pos == 'bottom' || pos == 'right' || pos == 'follow'}
    function create_if_block_1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(span, "class", "svelte-14rlmtf");
    			add_location(span, file$5, 29, 3, 741);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(29:2) {#if pos == 'bottom' || pos == 'right' || pos == 'follow'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*on*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*on*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*on*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, []);
    	let { title, pos, x = null, y = null, delay, on = false } = $$props;
    	let followMouse;
    	const writable_props = ['title', 'pos', 'x', 'y', 'delay', 'on'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('pos' in $$props) $$invalidate(1, pos = $$props.pos);
    		if ('x' in $$props) $$invalidate(5, x = $$props.x);
    		if ('y' in $$props) $$invalidate(6, y = $$props.y);
    		if ('delay' in $$props) $$invalidate(2, delay = $$props.delay);
    		if ('on' in $$props) $$invalidate(3, on = $$props.on);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		title,
    		pos,
    		x,
    		y,
    		delay,
    		on,
    		followMouse
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('pos' in $$props) $$invalidate(1, pos = $$props.pos);
    		if ('x' in $$props) $$invalidate(5, x = $$props.x);
    		if ('y' in $$props) $$invalidate(6, y = $$props.y);
    		if ('delay' in $$props) $$invalidate(2, delay = $$props.delay);
    		if ('on' in $$props) $$invalidate(3, on = $$props.on);
    		if ('followMouse' in $$props) $$invalidate(4, followMouse = $$props.followMouse);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*x, y*/ 96) {
    			if (x !== null) {
    				$$invalidate(4, followMouse = `top: ${y + 5}px; left: ${x + 5}px;`);
    			}
    		}
    	};

    	return [title, pos, delay, on, followMouse, x, y];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			title: 0,
    			pos: 1,
    			x: 5,
    			y: 6,
    			delay: 2,
    			on: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'title'");
    		}

    		if (/*pos*/ ctx[1] === undefined && !('pos' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'pos'");
    		}

    		if (/*delay*/ ctx[2] === undefined && !('delay' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'delay'");
    		}
    	}

    	get title() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pos() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pos(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get delay() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set delay(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get on() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set on(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const position = createEnum(['top', 'bottom', 'right', 'left', 'follow']),

    	tooltip = (node, { pos = position.top, delay = 200 } = {}) => {
    		let title = node.getAttribute('title'), cachedpos = getComputedStyle(node).position,
    			tooltip = new Tooltip({
    				props: {
    					title: title,
    					pos: pos,
    					delay: delay
    				},
    				target: node,
    			});

    		node.removeAttribute('title');

    		// Potential issue overwriting position
    		node.style.setProperty('position', 'relative');

    		const
    			mouseOver = (e) => {
    				tooltip.$set({ on: true });
    				if (pos === position.follow)
    					node.addEventListener('mousemove', mouseMove);
    			},

    			mouseMove = (e) => {
    				const rect = node.getBoundingClientRect();
    				tooltip.$set({ x: e.pageX - rect.x, y: e.pageY - rect.y, });
    			},

    			mouseLeave = () => {
    				tooltip.$set({ on: false });
    				node.removeEventListener('mousemove', mouseMove);
    			};

    		node.addEventListener('mouseover', mouseOver);
    		node.addEventListener('mouseleave', mouseLeave);

    		return {
    			destroy() {
    				tooltip.$destroy();
    				node.style.setProperty('position', cachedpos);
    				node.removeEventListener('mouseover', mouseOver);
    				node.removeEventListener('mouseleave', mouseLeave);
    				node.removeEventListener('mousemove', mouseMove);
    			}
    		}
    	};

    /* src/Card.svelte generated by Svelte v3.44.1 */
    const file$4 = "src/Card.svelte";

    function create_fragment$4(ctx) {
    	let article;
    	let div;
    	let parts_avataaar;
    	let t0;
    	let h4;
    	let t1_value = /*user*/ ctx[0].name.first + "";
    	let t1;
    	let t2;
    	let t3_value = /*user*/ ctx[0].name.last + "";
    	let t3;
    	let t4;
    	let h60;
    	let t6;
    	let h61;
    	let t8;
    	let p;
    	let a;
    	let t9_value = /*user*/ ctx[0].email + "";
    	let t9;
    	let br0;
    	let t10;
    	let t11_value = /*user*/ ctx[0].cell + "";
    	let t11;
    	let br1;
    	let t12;
    	let t13_value = new Date(/*user*/ ctx[0].dob.date).toLocaleDateString('sv-SE') + "";
    	let t13;
    	let br2;
    	let article_title_value;
    	let article_transition;
    	let current;
    	let mounted;
    	let dispose;

    	parts_avataaar = new Avataaar({
    			props: {
    				seed: /*user*/ ctx[0].login.md5,
    				gender: /*user*/ ctx[0].gender,
    				width: "64"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article = element("article");
    			div = element("div");
    			create_component(parts_avataaar.$$.fragment);
    			t0 = space();
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			h60 = element("h6");
    			h60.textContent = `${title()}`;
    			t6 = space();
    			h61 = element("h6");
    			h61.textContent = `${corporation()}`;
    			t8 = space();
    			p = element("p");
    			a = element("a");
    			t9 = text(t9_value);
    			br0 = element("br");
    			t10 = space();
    			t11 = text(t11_value);
    			br1 = element("br");
    			t12 = space();
    			t13 = text(t13_value);
    			br2 = element("br");
    			attr_dev(div, "class", "avatar svelte-1yryd0w");
    			add_location(div, file$4, 12, 1, 361);
    			attr_dev(h4, "class", "svelte-1yryd0w");
    			add_location(h4, file$4, 16, 1, 467);
    			attr_dev(h60, "class", "svelte-1yryd0w");
    			add_location(h60, file$4, 17, 1, 512);
    			attr_dev(h61, "class", "corp svelte-1yryd0w");
    			add_location(h61, file$4, 18, 1, 532);
    			attr_dev(a, "href", "#void");
    			add_location(a, file$4, 21, 2, 578);
    			add_location(br0, file$4, 21, 34, 610);
    			add_location(br1, file$4, 22, 13, 630);
    			add_location(br2, file$4, 24, 55, 720);
    			attr_dev(p, "class", "svelte-1yryd0w");
    			add_location(p, file$4, 20, 1, 572);
    			attr_dev(article, "title", article_title_value = "" + (/*user*/ ctx[0].name.first + " " + /*user*/ ctx[0].name.last));
    			attr_dev(article, "class", "svelte-1yryd0w");
    			add_location(article, file$4, 11, 0, 255);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div);
    			mount_component(parts_avataaar, div, null);
    			append_dev(article, t0);
    			append_dev(article, h4);
    			append_dev(h4, t1);
    			append_dev(h4, t2);
    			append_dev(h4, t3);
    			append_dev(article, t4);
    			append_dev(article, h60);
    			append_dev(article, t6);
    			append_dev(article, h61);
    			append_dev(article, t8);
    			append_dev(article, p);
    			append_dev(p, a);
    			append_dev(a, t9);
    			append_dev(p, br0);
    			append_dev(p, t10);
    			append_dev(p, t11);
    			append_dev(p, br1);
    			append_dev(p, t12);
    			append_dev(p, t13);
    			append_dev(p, br2);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(tooltip.call(null, article));
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const parts_avataaar_changes = {};
    			if (dirty & /*user*/ 1) parts_avataaar_changes.seed = /*user*/ ctx[0].login.md5;
    			if (dirty & /*user*/ 1) parts_avataaar_changes.gender = /*user*/ ctx[0].gender;
    			parts_avataaar.$set(parts_avataaar_changes);
    			if ((!current || dirty & /*user*/ 1) && t1_value !== (t1_value = /*user*/ ctx[0].name.first + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*user*/ 1) && t3_value !== (t3_value = /*user*/ ctx[0].name.last + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*user*/ 1) && t9_value !== (t9_value = /*user*/ ctx[0].email + "")) set_data_dev(t9, t9_value);
    			if ((!current || dirty & /*user*/ 1) && t11_value !== (t11_value = /*user*/ ctx[0].cell + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*user*/ 1) && t13_value !== (t13_value = new Date(/*user*/ ctx[0].dob.date).toLocaleDateString('sv-SE') + "")) set_data_dev(t13, t13_value);

    			if (!current || dirty & /*user*/ 1 && article_title_value !== (article_title_value = "" + (/*user*/ ctx[0].name.first + " " + /*user*/ ctx[0].name.last))) {
    				attr_dev(article, "title", article_title_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parts_avataaar.$$.fragment, local);

    			add_render_callback(() => {
    				if (!article_transition) article_transition = create_bidirectional_transition(article, fade, { delay: /*index*/ ctx[1] * 30 }, true);
    				article_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parts_avataaar.$$.fragment, local);
    			if (!article_transition) article_transition = create_bidirectional_transition(article, fade, { delay: /*index*/ ctx[1] * 30 }, false);
    			article_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(parts_avataaar);
    			if (detaching && article_transition) article_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let { user, index = 0 } = $$props;
    	const writable_props = ['user', 'index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		Parts,
    		fade,
    		title,
    		corporation,
    		tooltip,
    		ö,
    		user,
    		index
    	});

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user, index];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { user: 0, index: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*user*/ ctx[0] === undefined && !('user' in props)) {
    			console.warn("<Card> was created without expected prop 'user'");
    		}
    	}

    	get user() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FormFields.svelte generated by Svelte v3.44.1 */

    const file$3 = "src/FormFields.svelte";

    function create_fragment$3(ctx) {
    	let fieldset;
    	let legend;
    	let t1;
    	let div0;
    	let t3;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let t11;
    	let input0;
    	let t12;
    	let datalist;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let t13;
    	let div1;
    	let t15;
    	let meter;
    	let t17;
    	let div2;
    	let t19;
    	let progress0;
    	let t21;
    	let progress1;
    	let t23;
    	let textarea;
    	let t24;
    	let input1;
    	let t25;
    	let input2;
    	let t26;
    	let input3;
    	let t27;
    	let input4;
    	let t28;
    	let input5;
    	let t29;
    	let input6;
    	let t30;
    	let br;
    	let t31;
    	let div3;
    	let t33;
    	let button;
    	let t35;
    	let div4;
    	let t37;
    	let input7;
    	let t38;
    	let div5;
    	let t40;
    	let input8;
    	let t41;
    	let div6;
    	let t43;
    	let input9;
    	let t44;
    	let div7;
    	let t46;
    	let input10;
    	let t47;
    	let div8;
    	let t49;
    	let input11;
    	let t50;
    	let div9;
    	let t52;
    	let input12;
    	let t53;
    	let div10;
    	let t55;
    	let input13;
    	let t56;
    	let div11;
    	let t58;
    	let input14;
    	let t59;
    	let div12;
    	let t61;
    	let input15;
    	let t62;
    	let div13;
    	let t64;
    	let input16;
    	let t65;
    	let div14;
    	let t67;
    	let input17;
    	let t68;
    	let div15;
    	let t70;
    	let input18;
    	let t71;
    	let div16;
    	let t73;
    	let input19;
    	let t74;
    	let div17;
    	let t76;
    	let input20;
    	let t77;
    	let div18;
    	let t79;
    	let input21;
    	let t80;
    	let div19;
    	let t82;
    	let input22;
    	let t83;
    	let div20;
    	let t85;
    	let input23;
    	let t86;
    	let div21;
    	let t88;
    	let input24;
    	let t89;
    	let div22;
    	let t91;
    	let input25;

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			legend = element("legend");
    			legend.textContent = "Choose your favourite monster";
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "Choose a pet:";
    			t3 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "--Please choose an option--";
    			option1 = element("option");
    			option1.textContent = "Dog";
    			option2 = element("option");
    			option2.textContent = "Cat";
    			option3 = element("option");
    			option3.textContent = "Hamster";
    			option4 = element("option");
    			option4.textContent = "Parrot";
    			option5 = element("option");
    			option5.textContent = "Spider";
    			option6 = element("option");
    			option6.textContent = "Goldfish";
    			t11 = space();
    			input0 = element("input");
    			t12 = space();
    			datalist = element("datalist");
    			option7 = element("option");
    			option8 = element("option");
    			option9 = element("option");
    			option10 = element("option");
    			option11 = element("option");
    			t13 = space();
    			div1 = element("div");
    			div1.textContent = "Fuel level:";
    			t15 = space();
    			meter = element("meter");
    			meter.textContent = "at 50/100";
    			t17 = space();
    			div2 = element("div");
    			div2.textContent = "File progress:";
    			t19 = space();
    			progress0 = element("progress");
    			progress0.textContent = "70%";
    			t21 = space();
    			progress1 = element("progress");
    			progress1.textContent = "70%";
    			t23 = space();
    			textarea = element("textarea");
    			t24 = space();
    			input1 = element("input");
    			t25 = space();
    			input2 = element("input");
    			t26 = space();
    			input3 = element("input");
    			t27 = space();
    			input4 = element("input");
    			t28 = space();
    			input5 = element("input");
    			t29 = space();
    			input6 = element("input");
    			t30 = space();
    			br = element("br");
    			t31 = space();
    			div3 = element("div");
    			div3.textContent = "button:";
    			t33 = space();
    			button = element("button");
    			button.textContent = "Button!";
    			t35 = space();
    			div4 = element("div");
    			div4.textContent = "checkbox:";
    			t37 = space();
    			input7 = element("input");
    			t38 = space();
    			div5 = element("div");
    			div5.textContent = "color:";
    			t40 = space();
    			input8 = element("input");
    			t41 = space();
    			div6 = element("div");
    			div6.textContent = "date:";
    			t43 = space();
    			input9 = element("input");
    			t44 = space();
    			div7 = element("div");
    			div7.textContent = "datetime-local:";
    			t46 = space();
    			input10 = element("input");
    			t47 = space();
    			div8 = element("div");
    			div8.textContent = "email:";
    			t49 = space();
    			input11 = element("input");
    			t50 = space();
    			div9 = element("div");
    			div9.textContent = "file:";
    			t52 = space();
    			input12 = element("input");
    			t53 = space();
    			div10 = element("div");
    			div10.textContent = "month:";
    			t55 = space();
    			input13 = element("input");
    			t56 = space();
    			div11 = element("div");
    			div11.textContent = "number:";
    			t58 = space();
    			input14 = element("input");
    			t59 = space();
    			div12 = element("div");
    			div12.textContent = "password:";
    			t61 = space();
    			input15 = element("input");
    			t62 = space();
    			div13 = element("div");
    			div13.textContent = "radio:";
    			t64 = space();
    			input16 = element("input");
    			t65 = space();
    			div14 = element("div");
    			div14.textContent = "range:";
    			t67 = space();
    			input17 = element("input");
    			t68 = space();
    			div15 = element("div");
    			div15.textContent = "reset:";
    			t70 = space();
    			input18 = element("input");
    			t71 = space();
    			div16 = element("div");
    			div16.textContent = "search:";
    			t73 = space();
    			input19 = element("input");
    			t74 = space();
    			div17 = element("div");
    			div17.textContent = "submit:";
    			t76 = space();
    			input20 = element("input");
    			t77 = space();
    			div18 = element("div");
    			div18.textContent = "tel:";
    			t79 = space();
    			input21 = element("input");
    			t80 = space();
    			div19 = element("div");
    			div19.textContent = "text:";
    			t82 = space();
    			input22 = element("input");
    			t83 = space();
    			div20 = element("div");
    			div20.textContent = "time:";
    			t85 = space();
    			input23 = element("input");
    			t86 = space();
    			div21 = element("div");
    			div21.textContent = "url:";
    			t88 = space();
    			input24 = element("input");
    			t89 = space();
    			div22 = element("div");
    			div22.textContent = "week:";
    			t91 = space();
    			input25 = element("input");
    			add_location(legend, file$3, 1, 1, 12);
    			attr_dev(div0, "for", "pet-select");
    			add_location(div0, file$3, 2, 1, 60);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$3, 5, 2, 143);
    			option1.__value = "dog";
    			option1.value = option1.__value;
    			add_location(option1, file$3, 6, 2, 199);
    			option2.__value = "cat";
    			option2.value = option2.__value;
    			add_location(option2, file$3, 7, 2, 234);
    			option3.__value = "hamster";
    			option3.value = option3.__value;
    			add_location(option3, file$3, 8, 2, 269);
    			option4.__value = "parrot";
    			option4.value = option4.__value;
    			add_location(option4, file$3, 9, 2, 312);
    			option5.__value = "spider";
    			option5.value = option5.__value;
    			add_location(option5, file$3, 10, 2, 353);
    			option6.__value = "goldfish";
    			option6.value = option6.__value;
    			add_location(option6, file$3, 11, 2, 394);
    			attr_dev(select, "name", "pets");
    			attr_dev(select, "id", "pet-select");
    			add_location(select, file$3, 4, 1, 104);
    			attr_dev(input0, "list", "ice-cream-flavors");
    			attr_dev(input0, "id", "ice-cream-choice");
    			attr_dev(input0, "name", "ice-cream-choice");
    			attr_dev(input0, "placeholder", "Do something");
    			add_location(input0, file$3, 14, 1, 450);
    			option7.__value = "Chocolate";
    			option7.value = option7.__value;
    			add_location(option7, file$3, 17, 2, 596);
    			option8.__value = "Coconut";
    			option8.value = option8.__value;
    			add_location(option8, file$3, 17, 30, 624);
    			option9.__value = "Mint";
    			option9.value = option9.__value;
    			add_location(option9, file$3, 17, 56, 650);
    			option10.__value = "Strawberry";
    			option10.value = option10.__value;
    			add_location(option10, file$3, 17, 79, 673);
    			option11.__value = "Vanilla";
    			option11.value = option11.__value;
    			add_location(option11, file$3, 17, 108, 702);
    			attr_dev(datalist, "id", "ice-cream-flavors");
    			add_location(datalist, file$3, 16, 1, 560);
    			attr_dev(div1, "for", "fuel");
    			add_location(div1, file$3, 20, 1, 744);
    			attr_dev(meter, "id", "fuel");
    			attr_dev(meter, "min", "0");
    			attr_dev(meter, "max", "100");
    			attr_dev(meter, "low", "33");
    			attr_dev(meter, "high", "66");
    			attr_dev(meter, "optimum", "80");
    			meter.value = "50";
    			add_location(meter, file$3, 22, 1, 780);
    			attr_dev(div2, "for", "file");
    			add_location(div2, file$3, 24, 1, 880);
    			attr_dev(progress0, "id", "file");
    			attr_dev(progress0, "max", "100");
    			progress0.value = "70";
    			add_location(progress0, file$3, 26, 1, 919);
    			attr_dev(progress1, "id", "file");
    			attr_dev(progress1, "max", "100");
    			add_location(progress1, file$3, 27, 1, 978);
    			add_location(fieldset, file$3, 0, 0, 0);
    			attr_dev(textarea, "id", "story");
    			attr_dev(textarea, "name", "story");
    			attr_dev(textarea, "rows", "5");
    			attr_dev(textarea, "cols", "33");
    			textarea.value = " It was a dark and stormy night... ";
    			add_location(textarea, file$3, 29, 0, 1037);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "id", "c1");
    			attr_dev(input1, "name", "x");
    			input1.checked = true;
    			add_location(input1, file$3, 31, 0, 1138);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "id", "c2");
    			attr_dev(input2, "name", "x");
    			add_location(input2, file$3, 32, 0, 1186);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "id", "c2");
    			attr_dev(input3, "name", "x");
    			input3.disabled = true;
    			add_location(input3, file$3, 33, 0, 1226);
    			attr_dev(input4, "type", "checkbox");
    			input4.checked = true;
    			add_location(input4, file$3, 35, 0, 1276);
    			attr_dev(input5, "type", "checkbox");
    			add_location(input5, file$3, 36, 0, 1310);
    			attr_dev(input6, "type", "checkbox");
    			input6.disabled = true;
    			add_location(input6, file$3, 37, 0, 1336);
    			add_location(br, file$3, 38, 0, 1371);
    			add_location(div3, file$3, 40, 0, 1379);
    			add_location(button, file$3, 41, 0, 1398);
    			add_location(div4, file$3, 42, 0, 1423);
    			attr_dev(input7, "type", "checkbox");
    			add_location(input7, file$3, 43, 0, 1444);
    			add_location(div5, file$3, 44, 0, 1470);
    			attr_dev(input8, "type", "color");
    			input8.value = "#e70d0d";
    			add_location(input8, file$3, 45, 0, 1488);
    			add_location(div6, file$3, 46, 0, 1527);
    			attr_dev(input9, "type", "date");
    			add_location(input9, file$3, 47, 0, 1544);
    			add_location(div7, file$3, 48, 0, 1566);
    			attr_dev(input10, "type", "datetime-local");
    			add_location(input10, file$3, 49, 0, 1593);
    			add_location(div8, file$3, 50, 0, 1625);
    			attr_dev(input11, "type", "email");
    			add_location(input11, file$3, 51, 0, 1643);
    			add_location(div9, file$3, 52, 0, 1666);
    			attr_dev(input12, "type", "file");
    			add_location(input12, file$3, 53, 0, 1683);
    			add_location(div10, file$3, 54, 0, 1705);
    			attr_dev(input13, "type", "month");
    			add_location(input13, file$3, 55, 0, 1723);
    			add_location(div11, file$3, 56, 0, 1746);
    			attr_dev(input14, "type", "number");
    			add_location(input14, file$3, 57, 0, 1765);
    			add_location(div12, file$3, 58, 0, 1789);
    			attr_dev(input15, "type", "password");
    			add_location(input15, file$3, 59, 0, 1810);
    			add_location(div13, file$3, 60, 0, 1836);
    			attr_dev(input16, "type", "radio");
    			add_location(input16, file$3, 61, 0, 1854);
    			add_location(div14, file$3, 62, 0, 1877);
    			attr_dev(input17, "type", "range");
    			add_location(input17, file$3, 63, 0, 1895);
    			add_location(div15, file$3, 64, 0, 1918);
    			attr_dev(input18, "type", "reset");
    			add_location(input18, file$3, 65, 0, 1936);
    			add_location(div16, file$3, 66, 0, 1959);
    			attr_dev(input19, "type", "search");
    			add_location(input19, file$3, 67, 0, 1978);
    			add_location(div17, file$3, 68, 0, 2002);
    			attr_dev(input20, "type", "submit");
    			add_location(input20, file$3, 69, 0, 2021);
    			add_location(div18, file$3, 70, 0, 2045);
    			attr_dev(input21, "type", "tel");
    			add_location(input21, file$3, 71, 0, 2061);
    			add_location(div19, file$3, 72, 0, 2082);
    			attr_dev(input22, "type", "text");
    			add_location(input22, file$3, 73, 0, 2099);
    			add_location(div20, file$3, 74, 0, 2121);
    			attr_dev(input23, "type", "time");
    			add_location(input23, file$3, 75, 0, 2138);
    			add_location(div21, file$3, 76, 0, 2160);
    			attr_dev(input24, "type", "url");
    			add_location(input24, file$3, 77, 0, 2176);
    			add_location(div22, file$3, 78, 0, 2197);
    			attr_dev(input25, "type", "week");
    			add_location(input25, file$3, 79, 0, 2214);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, legend);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, div0);
    			append_dev(fieldset, t3);
    			append_dev(fieldset, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			append_dev(select, option6);
    			append_dev(fieldset, t11);
    			append_dev(fieldset, input0);
    			append_dev(fieldset, t12);
    			append_dev(fieldset, datalist);
    			append_dev(datalist, option7);
    			append_dev(datalist, option8);
    			append_dev(datalist, option9);
    			append_dev(datalist, option10);
    			append_dev(datalist, option11);
    			append_dev(fieldset, t13);
    			append_dev(fieldset, div1);
    			append_dev(fieldset, t15);
    			append_dev(fieldset, meter);
    			append_dev(fieldset, t17);
    			append_dev(fieldset, div2);
    			append_dev(fieldset, t19);
    			append_dev(fieldset, progress0);
    			append_dev(fieldset, t21);
    			append_dev(fieldset, progress1);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, textarea, anchor);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, input1, anchor);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, input2, anchor);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, input3, anchor);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, input4, anchor);
    			insert_dev(target, t28, anchor);
    			insert_dev(target, input5, anchor);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, input6, anchor);
    			insert_dev(target, t30, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, div3, anchor);
    			insert_dev(target, t33, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t35, anchor);
    			insert_dev(target, div4, anchor);
    			insert_dev(target, t37, anchor);
    			insert_dev(target, input7, anchor);
    			insert_dev(target, t38, anchor);
    			insert_dev(target, div5, anchor);
    			insert_dev(target, t40, anchor);
    			insert_dev(target, input8, anchor);
    			insert_dev(target, t41, anchor);
    			insert_dev(target, div6, anchor);
    			insert_dev(target, t43, anchor);
    			insert_dev(target, input9, anchor);
    			insert_dev(target, t44, anchor);
    			insert_dev(target, div7, anchor);
    			insert_dev(target, t46, anchor);
    			insert_dev(target, input10, anchor);
    			insert_dev(target, t47, anchor);
    			insert_dev(target, div8, anchor);
    			insert_dev(target, t49, anchor);
    			insert_dev(target, input11, anchor);
    			insert_dev(target, t50, anchor);
    			insert_dev(target, div9, anchor);
    			insert_dev(target, t52, anchor);
    			insert_dev(target, input12, anchor);
    			insert_dev(target, t53, anchor);
    			insert_dev(target, div10, anchor);
    			insert_dev(target, t55, anchor);
    			insert_dev(target, input13, anchor);
    			insert_dev(target, t56, anchor);
    			insert_dev(target, div11, anchor);
    			insert_dev(target, t58, anchor);
    			insert_dev(target, input14, anchor);
    			insert_dev(target, t59, anchor);
    			insert_dev(target, div12, anchor);
    			insert_dev(target, t61, anchor);
    			insert_dev(target, input15, anchor);
    			insert_dev(target, t62, anchor);
    			insert_dev(target, div13, anchor);
    			insert_dev(target, t64, anchor);
    			insert_dev(target, input16, anchor);
    			insert_dev(target, t65, anchor);
    			insert_dev(target, div14, anchor);
    			insert_dev(target, t67, anchor);
    			insert_dev(target, input17, anchor);
    			insert_dev(target, t68, anchor);
    			insert_dev(target, div15, anchor);
    			insert_dev(target, t70, anchor);
    			insert_dev(target, input18, anchor);
    			insert_dev(target, t71, anchor);
    			insert_dev(target, div16, anchor);
    			insert_dev(target, t73, anchor);
    			insert_dev(target, input19, anchor);
    			insert_dev(target, t74, anchor);
    			insert_dev(target, div17, anchor);
    			insert_dev(target, t76, anchor);
    			insert_dev(target, input20, anchor);
    			insert_dev(target, t77, anchor);
    			insert_dev(target, div18, anchor);
    			insert_dev(target, t79, anchor);
    			insert_dev(target, input21, anchor);
    			insert_dev(target, t80, anchor);
    			insert_dev(target, div19, anchor);
    			insert_dev(target, t82, anchor);
    			insert_dev(target, input22, anchor);
    			insert_dev(target, t83, anchor);
    			insert_dev(target, div20, anchor);
    			insert_dev(target, t85, anchor);
    			insert_dev(target, input23, anchor);
    			insert_dev(target, t86, anchor);
    			insert_dev(target, div21, anchor);
    			insert_dev(target, t88, anchor);
    			insert_dev(target, input24, anchor);
    			insert_dev(target, t89, anchor);
    			insert_dev(target, div22, anchor);
    			insert_dev(target, t91, anchor);
    			insert_dev(target, input25, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(textarea);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(input3);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(input4);
    			if (detaching) detach_dev(t28);
    			if (detaching) detach_dev(input5);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(input6);
    			if (detaching) detach_dev(t30);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t33);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t35);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t37);
    			if (detaching) detach_dev(input7);
    			if (detaching) detach_dev(t38);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t40);
    			if (detaching) detach_dev(input8);
    			if (detaching) detach_dev(t41);
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t43);
    			if (detaching) detach_dev(input9);
    			if (detaching) detach_dev(t44);
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t46);
    			if (detaching) detach_dev(input10);
    			if (detaching) detach_dev(t47);
    			if (detaching) detach_dev(div8);
    			if (detaching) detach_dev(t49);
    			if (detaching) detach_dev(input11);
    			if (detaching) detach_dev(t50);
    			if (detaching) detach_dev(div9);
    			if (detaching) detach_dev(t52);
    			if (detaching) detach_dev(input12);
    			if (detaching) detach_dev(t53);
    			if (detaching) detach_dev(div10);
    			if (detaching) detach_dev(t55);
    			if (detaching) detach_dev(input13);
    			if (detaching) detach_dev(t56);
    			if (detaching) detach_dev(div11);
    			if (detaching) detach_dev(t58);
    			if (detaching) detach_dev(input14);
    			if (detaching) detach_dev(t59);
    			if (detaching) detach_dev(div12);
    			if (detaching) detach_dev(t61);
    			if (detaching) detach_dev(input15);
    			if (detaching) detach_dev(t62);
    			if (detaching) detach_dev(div13);
    			if (detaching) detach_dev(t64);
    			if (detaching) detach_dev(input16);
    			if (detaching) detach_dev(t65);
    			if (detaching) detach_dev(div14);
    			if (detaching) detach_dev(t67);
    			if (detaching) detach_dev(input17);
    			if (detaching) detach_dev(t68);
    			if (detaching) detach_dev(div15);
    			if (detaching) detach_dev(t70);
    			if (detaching) detach_dev(input18);
    			if (detaching) detach_dev(t71);
    			if (detaching) detach_dev(div16);
    			if (detaching) detach_dev(t73);
    			if (detaching) detach_dev(input19);
    			if (detaching) detach_dev(t74);
    			if (detaching) detach_dev(div17);
    			if (detaching) detach_dev(t76);
    			if (detaching) detach_dev(input20);
    			if (detaching) detach_dev(t77);
    			if (detaching) detach_dev(div18);
    			if (detaching) detach_dev(t79);
    			if (detaching) detach_dev(input21);
    			if (detaching) detach_dev(t80);
    			if (detaching) detach_dev(div19);
    			if (detaching) detach_dev(t82);
    			if (detaching) detach_dev(input22);
    			if (detaching) detach_dev(t83);
    			if (detaching) detach_dev(div20);
    			if (detaching) detach_dev(t85);
    			if (detaching) detach_dev(input23);
    			if (detaching) detach_dev(t86);
    			if (detaching) detach_dev(div21);
    			if (detaching) detach_dev(t88);
    			if (detaching) detach_dev(input24);
    			if (detaching) detach_dev(t89);
    			if (detaching) detach_dev(div22);
    			if (detaching) detach_dev(t91);
    			if (detaching) detach_dev(input25);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormFields', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormFields> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class FormFields extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormFields",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const mobileMenuVisible = writable(false);
    const isSmallScreen = writable(false);
    const isDarkMode = writable(false);

    /* src/Component.svelte generated by Svelte v3.44.1 */
    const file$2 = "src/Component.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (31:2) {#each Array(3) as _}
    function create_each_block$1(ctx) {
    	let article;
    	let h2;
    	let raw0_value = löremIpsum(/*headline*/ ctx[3]) + "";
    	let t0;
    	let p_1;
    	let raw1_value = löremIpsum(/*preamble*/ ctx[2]) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			article = element("article");
    			h2 = element("h2");
    			t0 = space();
    			p_1 = element("p");
    			t1 = space();
    			add_location(h2, file$2, 32, 4, 591);
    			add_location(p_1, file$2, 33, 4, 628);
    			add_location(article, file$2, 31, 3, 577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, h2);
    			h2.innerHTML = raw0_value;
    			append_dev(article, t0);
    			append_dev(article, p_1);
    			p_1.innerHTML = raw1_value;
    			append_dev(article, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(31:2) {#each Array(3) as _}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let div;
    	let t0;
    	let h2;
    	let t1_value = /*props*/ ctx[0].hello + "";
    	let t1;
    	let t2;
    	let p0;
    	let raw0_value = löremIpsum(/*p*/ ctx[1]) + "";
    	let t3;
    	let h3;
    	let t4_value = /*props*/ ctx[0].hello + "";
    	let t4;
    	let t5;
    	let p1;
    	let raw1_value = löremIpsum(/*p*/ ctx[1]) + "";
    	let t6;
    	let h4;
    	let t7_value = /*props*/ ctx[0].hello + "";
    	let t7;
    	let t8;
    	let p2;
    	let raw2_value = löremIpsum(/*p*/ ctx[1]) + "";
    	let t9;
    	let h5;
    	let t10_value = /*props*/ ctx[0].hello + "";
    	let t10;
    	let t11;
    	let p3;
    	let raw3_value = löremIpsum(/*p*/ ctx[1]) + "";
    	let t12;
    	let h6;
    	let t13_value = /*props*/ ctx[0].hello + "";
    	let t13;
    	let t14;
    	let p4;
    	let raw4_value = löremIpsum(/*p*/ ctx[1]) + "";
    	let each_value = Array(3);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			h2 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = space();
    			h3 = element("h3");
    			t4 = text(t4_value);
    			t5 = space();
    			p1 = element("p");
    			t6 = space();
    			h4 = element("h4");
    			t7 = text(t7_value);
    			t8 = space();
    			p2 = element("p");
    			t9 = space();
    			h5 = element("h5");
    			t10 = text(t10_value);
    			t11 = space();
    			p3 = element("p");
    			t12 = space();
    			h6 = element("h6");
    			t13 = text(t13_value);
    			t14 = space();
    			p4 = element("p");
    			attr_dev(div, "class", "svelte-11ey6yf");
    			add_location(div, file$2, 29, 1, 544);
    			attr_dev(section, "class", "full svelte-11ey6yf");
    			add_location(section, file$2, 28, 0, 520);
    			add_location(h2, file$2, 38, 0, 702);
    			add_location(p0, file$2, 39, 0, 725);
    			add_location(h3, file$2, 41, 0, 750);
    			add_location(p1, file$2, 42, 0, 773);
    			add_location(h4, file$2, 44, 0, 798);
    			add_location(p2, file$2, 45, 0, 821);
    			add_location(h5, file$2, 47, 0, 846);
    			add_location(p3, file$2, 48, 0, 869);
    			add_location(h6, file$2, 50, 0, 894);
    			add_location(p4, file$2, 51, 0, 917);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			p0.innerHTML = raw0_value;
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p1, anchor);
    			p1.innerHTML = raw1_value;
    			insert_dev(target, t6, anchor);
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p2, anchor);
    			p2.innerHTML = raw2_value;
    			insert_dev(target, t9, anchor);
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p3, anchor);
    			p3.innerHTML = raw3_value;
    			insert_dev(target, t12, anchor);
    			insert_dev(target, h6, anchor);
    			append_dev(h6, t13);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, p4, anchor);
    			p4.innerHTML = raw4_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*lörem, preamble, headline*/ 12) {
    				each_value = Array(3);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*props*/ 1 && t1_value !== (t1_value = /*props*/ ctx[0].hello + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*props*/ 1 && t4_value !== (t4_value = /*props*/ ctx[0].hello + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*props*/ 1 && t7_value !== (t7_value = /*props*/ ctx[0].hello + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*props*/ 1 && t10_value !== (t10_value = /*props*/ ctx[0].hello + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*props*/ 1 && t13_value !== (t13_value = /*props*/ ctx[0].hello + "")) set_data_dev(t13, t13_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(h6);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(p4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Component', slots, []);

    	const p = {
    			useLörem: false,
    			numberOfParagraphs: 2,
    			maxSentenceLength: 6,
    			sentencesPerParagraph: 4
    		},
    		preamble = {
    			useLörem: false,
    			numberOfParagraphs: 1,
    			maxSentenceLength: 6,
    			sentencesPerParagraph: 4
    		},
    		headline = {
    			useLörem: false,
    			isHeadline: true,
    			numberOfParagraphs: 1,
    			maxSentenceLength: 6,
    			sentencesPerParagraph: 1
    		};

    	let { props } = $$props;
    	const writable_props = ['props'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Component> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('props' in $$props) $$invalidate(0, props = $$props.props);
    	};

    	$$self.$capture_state = () => ({
    		isSmallScreen,
    		lörem: löremIpsum,
    		ö,
    		p,
    		preamble,
    		headline,
    		props
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(0, props = $$props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [props, p, preamble, headline];
    }

    class Component extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { props: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Component",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*props*/ ctx[0] === undefined && !('props' in props)) {
    			console.warn("<Component> was created without expected prop 'props'");
    		}
    	}

    	get props() {
    		throw new Error("<Component>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<Component>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* src/parts/ProximityAlert.svelte generated by Svelte v3.44.1 */
    const file$1 = "src/parts/ProximityAlert.svelte";

    function create_fragment$1(ctx) {
    	let t0;
    	let div1;
    	let icon;
    	let t1;
    	let div0;
    	let t2;
    	let div2;
    	let t4;
    	let link;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { type: "comment", color: "light" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(icon.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			div2 = element("div");
    			div2.textContent = "testa";
    			t4 = space();
    			link = element("link");
    			attr_dev(div0, "class", "dot svelte-mn2ruf");
    			attr_dev(div0, "style", /*s*/ ctx[1]);
    			add_location(div0, file$1, 44, 1, 1025);
    			attr_dev(div1, "class", "wrapper svelte-mn2ruf");
    			add_location(div1, file$1, 42, 0, 948);
    			attr_dev(div2, "class", "test svelte-mn2ruf");
    			add_location(div2, file$1, 47, 0, 1063);
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "href", "https://use.typekit.net/twk4oqd.css");
    			add_location(link, file$1, 49, 0, 1094);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(icon, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			/*div1_binding*/ ctx[9](div1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, link, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(document.body, "mousemove", /*onMousemove*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*s*/ 2) {
    				attr_dev(div0, "style", /*s*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(icon);
    			/*div1_binding*/ ctx[9](null);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(link);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let s;
    	let $dist;
    	let $y;
    	let $x;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProximityAlert', slots, []);
    	const maxDist = 250, springsettings = { stiffness: 0.05, damping: 0.75 };

    	let x = spring(0, springsettings),
    		y = spring(0, springsettings),
    		dist = spring(0, springsettings);

    	validate_store(x, 'x');
    	component_subscribe($$self, x, value => $$invalidate(8, $x = value));
    	validate_store(y, 'y');
    	component_subscribe($$self, y, value => $$invalidate(7, $y = value));
    	validate_store(dist, 'dist');
    	component_subscribe($$self, dist, value => $$invalidate(6, $dist = value));

    	const onMousemove = e => {
    		const r = el.getBoundingClientRect(),
    			w = r.width / 2,
    			h = r.height / 2,
    			d = Math.hypot(e.pageX - (r.x + w), e.pageY - (r.y + h)),
    			factor = maxDist / (maxDist - d);

    		if (d < maxDist) {
    			set_store_value(x, $x = (e.pageX - (r.x + w)) / factor + w, $x);
    			set_store_value(y, $y = (e.pageY - (r.y + h)) / factor + h, $y);
    		} else {
    			set_store_value(x, $x = w, $x);
    			set_store_value(y, $y = h, $y);
    		}

    		set_store_value(dist, $dist = Math.hypot($x - w, $y - h) * 1.025, $dist);
    	};

    	let el;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProximityAlert> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$capture_state = () => ({
    		spring,
    		Icon,
    		maxDist,
    		springsettings,
    		x,
    		y,
    		dist,
    		onMousemove,
    		el,
    		s,
    		$dist,
    		$y,
    		$x
    	});

    	$$self.$inject_state = $$props => {
    		if ('x' in $$props) $$invalidate(2, x = $$props.x);
    		if ('y' in $$props) $$invalidate(3, y = $$props.y);
    		if ('dist' in $$props) $$invalidate(4, dist = $$props.dist);
    		if ('el' in $$props) $$invalidate(0, el = $$props.el);
    		if ('s' in $$props) $$invalidate(1, s = $$props.s);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$x, $y, $dist*/ 448) {
    			$$invalidate(1, s = `
	transform: translate(${$x}px, ${$y}px);
	opacity:${$dist / 100 + 0.15}; 
	width:	${$dist * 2 + 50}px; 
	height:	${$dist * 2 + 50}px; 
	top: 	${-$dist - 25}px; 
	left: 	${-$dist - 25}px;`);
    		}
    	};

    	return [el, s, x, y, dist, onMousemove, $dist, $y, $x, div1_binding];
    }

    class ProximityAlert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProximityAlert",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */

    const { document: document_1, window: window_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (1:0) <script>  import Card from './Card.svelte';  import FormFields from './FormFields.svelte';  import Component from './Component.svelte';  import * as Parts from './parts/';   import { isSmallScreen, isDarkMode, mobileMenuVisible }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>  import Card from './Card.svelte';  import FormFields from './FormFields.svelte';  import Component from './Component.svelte';  import * as Parts from './parts/';   import { isSmallScreen, isDarkMode, mobileMenuVisible }",
    		ctx
    	});

    	return block;
    }

    // (55:1) {:then users}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*users*/ ctx[4].results;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*users*/ 16) {
    				each_value_1 = /*users*/ ctx[4].results;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(55:1) {:then users}",
    		ctx
    	});

    	return block;
    }

    // (56:2) {#each users.results as user, i}
    function create_each_block_1(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				user: /*user*/ ctx[11],
    				index: /*i*/ ctx[13]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(56:2) {#each users.results as user, i}",
    		ctx
    	});

    	return block;
    }

    // (53:15)    <Parts.Loader />  {:then users}
    function create_pending_block(ctx) {
    	let parts_loader;
    	let current;
    	parts_loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(parts_loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parts_loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parts_loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parts_loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parts_loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(53:15)    <Parts.Loader />  {:then users}",
    		ctx
    	});

    	return block;
    }

    // (62:1) {#each Array(36) as _}
    function create_each_block(ctx) {
    	let parts_avataaar;
    	let current;

    	parts_avataaar = new Avataaar({
    			props: { seed: Math.random(), width: "40" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parts_avataaar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parts_avataaar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parts_avataaar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parts_avataaar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parts_avataaar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(62:1) {#each Array(36) as _}",
    		ctx
    	});

    	return block;
    }

    // (69:0) {:else}
    function create_else_block(ctx) {
    	let component;
    	let current;

    	component = new Component({
    			props: { props: /*props*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(component.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(component, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const component_changes = {};
    			if (dirty & /*props*/ 1) component_changes.props = /*props*/ ctx[0];
    			component.$set(component_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(component.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(component.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(component, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(69:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (67:0) {#if $isSmallScreen}
    function create_if_block(ctx) {
    	let component;
    	let current;

    	component = new Component({
    			props: { props: { hello: 'Hello mobile!' } },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(component.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(component, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(component.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(component.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(component, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(67:0) {#if $isSmallScreen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let proximityalert;
    	let t0;
    	let p0;
    	let t1;
    	let p1;
    	let t2;
    	let p2;
    	let t3;
    	let p3;
    	let t4;
    	let p4;
    	let t5;
    	let parts_switch0;
    	let updating_value;
    	let t6;
    	let div;
    	let h1;
    	let t8;
    	let section0;
    	let t9;
    	let section1;
    	let t10;
    	let current_block_type_index;
    	let if_block;
    	let t11;
    	let parts_slider;
    	let t12;
    	let parts_switch1;
    	let t13;
    	let formfields;
    	let t14;
    	let link0;
    	let link1;
    	let link2;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[6]);
    	proximityalert = new ProximityAlert({ $$inline: true });

    	function parts_switch0_value_binding(value) {
    		/*parts_switch0_value_binding*/ ctx[7](value);
    	}

    	let parts_switch0_props = { title: "Dark mode" };

    	if (/*$isDarkMode*/ ctx[2] !== void 0) {
    		parts_switch0_props.value = /*$isDarkMode*/ ctx[2];
    	}

    	parts_switch0 = new Switch({
    			props: parts_switch0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(parts_switch0, 'value', parts_switch0_value_binding));

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 4,
    		blocks: [,,,]
    	};

    	handle_promise(/*users*/ ctx[4], info);
    	let each_value = Array(36);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$isSmallScreen*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	parts_slider = new Slider({ $$inline: true });
    	parts_switch1 = new Switch({ $$inline: true });
    	formfields = new FormFields({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(proximityalert.$$.fragment);
    			t0 = space();
    			p0 = element("p");
    			t1 = space();
    			p1 = element("p");
    			t2 = space();
    			p2 = element("p");
    			t3 = space();
    			p3 = element("p");
    			t4 = space();
    			p4 = element("p");
    			t5 = space();
    			create_component(parts_switch0.$$.fragment);
    			t6 = space();
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Testing testing.";
    			t8 = space();
    			section0 = element("section");
    			info.block.c();
    			t9 = space();
    			section1 = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			if_block.c();
    			t11 = space();
    			create_component(parts_slider.$$.fragment);
    			t12 = space();
    			create_component(parts_switch1.$$.fragment);
    			t13 = space();
    			create_component(formfields.$$.fragment);
    			t14 = space();
    			link0 = element("link");
    			link1 = element("link");
    			link2 = element("link");
    			add_location(p0, file, 41, 0, 1179);
    			add_location(p1, file, 42, 0, 1185);
    			add_location(p2, file, 43, 0, 1191);
    			add_location(p3, file, 44, 0, 1197);
    			add_location(p4, file, 45, 0, 1203);
    			attr_dev(h1, "title", "this is a greeting from action");
    			add_location(h1, file, 49, 1, 1290);
    			attr_dev(div, "class", "full");
    			add_location(div, file, 48, 0, 1270);
    			attr_dev(section0, "class", "users svelte-1sjtp8o");
    			add_location(section0, file, 51, 0, 1374);
    			attr_dev(section1, "class", "avatars svelte-1sjtp8o");
    			add_location(section1, file, 60, 0, 1543);
    			attr_dev(link0, "rel", "preconnect");
    			attr_dev(link0, "href", "https://fonts.googleapis.com");
    			add_location(link0, file, 86, 1, 1922);
    			attr_dev(link1, "rel", "preconnect");
    			attr_dev(link1, "href", "https://fonts.gstatic.com");
    			attr_dev(link1, "crossorigin", "");
    			add_location(link1, file, 87, 1, 1985);
    			attr_dev(link2, "href", "https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&family=DM+Serif+Display&family=DM+Serif+Text:ital@0;1&family=Manuale:ital,wght@0,400;0,600;1,400;1,600&family=DM+Mono&display=swap");
    			attr_dev(link2, "rel", "stylesheet");
    			add_location(link2, file, 88, 1, 2057);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(proximityalert, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(parts_switch0, target, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, section0, anchor);
    			info.block.m(section0, info.anchor = null);
    			info.mount = () => section0;
    			info.anchor = null;
    			insert_dev(target, t9, anchor);
    			insert_dev(target, section1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section1, null);
    			}

    			insert_dev(target, t10, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(parts_slider, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(parts_switch1, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(formfields, target, anchor);
    			insert_dev(target, t14, anchor);
    			append_dev(document_1.head, link0);
    			append_dev(document_1.head, link1);
    			append_dev(document_1.head, link2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "resize", /*onwindowresize*/ ctx[6]),
    					action_destroyer(tooltip.call(null, h1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const parts_switch0_changes = {};

    			if (!updating_value && dirty & /*$isDarkMode*/ 4) {
    				updating_value = true;
    				parts_switch0_changes.value = /*$isDarkMode*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			parts_switch0.$set(parts_switch0_changes);
    			update_await_block_branch(info, ctx, dirty);

    			if (dirty & /*Math*/ 0) {
    				each_value = Array(36);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(t11.parentNode, t11);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(proximityalert.$$.fragment, local);
    			transition_in(parts_switch0.$$.fragment, local);
    			transition_in(info.block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			transition_in(parts_slider.$$.fragment, local);
    			transition_in(parts_switch1.$$.fragment, local);
    			transition_in(formfields.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(proximityalert.$$.fragment, local);
    			transition_out(parts_switch0.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			transition_out(parts_slider.$$.fragment, local);
    			transition_out(parts_switch1.$$.fragment, local);
    			transition_out(formfields.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(proximityalert, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t5);
    			destroy_component(parts_switch0, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(section0);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(section1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t10);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(parts_slider, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(parts_switch1, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(formfields, detaching);
    			if (detaching) detach_dev(t14);
    			detach_dev(link0);
    			detach_dev(link1);
    			detach_dev(link2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $mobileMenuVisible;
    	let $isDarkMode;
    	let $isSmallScreen;
    	validate_store(mobileMenuVisible, 'mobileMenuVisible');
    	component_subscribe($$self, mobileMenuVisible, $$value => $$invalidate(5, $mobileMenuVisible = $$value));
    	validate_store(isDarkMode, 'isDarkMode');
    	component_subscribe($$self, isDarkMode, $$value => $$invalidate(2, $isDarkMode = $$value));
    	validate_store(isSmallScreen, 'isSmallScreen');
    	component_subscribe($$self, isSmallScreen, $$value => $$invalidate(3, $isSmallScreen = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let props = { hello: 'Hello world!' },
    		users = load('https://randomuser.me/api/?results=8'),
    		innerWidth;

    	// Read/write local storage
    	//localStorage.clear();
    	props = getLocal('props') ?? props;

    	set_store_value(isDarkMode, $isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches, $isDarkMode);
    	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => set_store_value(isDarkMode, $isDarkMode = e.matches, $isDarkMode));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, innerWidth = window_1.innerWidth);
    	}

    	function parts_switch0_value_binding(value) {
    		$isDarkMode = value;
    		isDarkMode.set($isDarkMode);
    	}

    	$$self.$capture_state = () => ({
    		Card,
    		FormFields,
    		Component,
    		Parts,
    		isSmallScreen,
    		isDarkMode,
    		mobileMenuVisible,
    		tooltip,
    		ö,
    		ProximityAlert,
    		props,
    		users,
    		innerWidth,
    		$mobileMenuVisible,
    		$isDarkMode,
    		$isSmallScreen
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(0, props = $$props.props);
    		if ('users' in $$props) $$invalidate(4, users = $$props.users);
    		if ('innerWidth' in $$props) $$invalidate(1, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 1) {
    			setLocal('props', props);
    		}

    		if ($$self.$$.dirty & /*innerWidth*/ 2) {
    			// "Media queries"
    			set_store_value(isSmallScreen, $isSmallScreen = innerWidth < 600, $isSmallScreen);
    		}

    		if ($$self.$$.dirty & /*$isDarkMode*/ 4) {
    			{
    				if ($isDarkMode) document.documentElement.classList.add('darkMode'); else document.documentElement.classList.remove('darkMode');
    			}
    		}

    		if ($$self.$$.dirty & /*$mobileMenuVisible*/ 32) {
    			// Menu
    			{
    				if ($mobileMenuVisible) document.body.classList.add('noScroll'); else document.body.classList.remove('noScroll');
    			}
    		}
    	};

    	return [
    		props,
    		innerWidth,
    		$isDarkMode,
    		$isSmallScreen,
    		users,
    		$mobileMenuVisible,
    		onwindowresize,
    		parts_switch0_value_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({ target: document.body });

    return app;

})();
//# sourceMappingURL=bundle.js.map
