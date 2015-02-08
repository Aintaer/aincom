---
title: Foray into asm.js
author: aintaer
---

Foray into `asm.js`
===

The state of [asm.js][1] is that it's only a research topic for now. The only
runtime supporting asm.js is the latest SpiderMonkey, currently only available
in [Firefox Nightly][2]. But the gain is the ability to run code at nearly native
speeds: usually within 100% of natively compiled C.

The restriction is that asm.js follows a much stricter subset of rules which,
though technically valid as JavaScript, is extremely tedious to hand-craft.
It uses annotations such as `x|0` or `+x` to coerce values into ints or
doubles. By the way, the only operations available inside asm.js context
are mathematical operations on signed/unsigned ints and doubles. No
strings, no objects, no memory management. Memory is intended to be
manually managed, the overall pool of which is requested once as a typed
array (e.g. `Int32Array`).

Now if this sounds super restrictive, its intent is to be a way to translate
directly into compiled machine code. The asm.js compiler checks the module for
conformance to the asm.js spec; if it validates, the code becomes immediately
compiled without having to trace (TraceMonkey), infer types (TI), or incur
garbage collection (Compartmental GC), all areas of JS engine specialization
that deal with the dynamic nature of JS.

Just so it's clear, asm.js is *not* JS. You are not writing the same language at
all. However, asm.js *is* JS. It doesn't need a special runtime or plugins. It
is simply taking the dynamicness out of JS and turning it into a statically
typed, manual memory managed language.

[1]: http://asmjs.org/spec/latest/
[2]: https://blog.mozilla.org/luke/2013/03/21/asm-js-in-firefox-nightly/

## LLVM

However, what asm.js is **perfect** for is porting other already statically
typed languages like C/C++. This is the what the latest work in the
[Emscripten][3] project is about. Emscripten can take the output of LLVM, and
emits asm.js code.

LLVM output is a low-level "bitcode", similar to the output of bytecode for the
JVM in the Java compiler. This bitcode can be then be optimized regardless of
the higher level language used to generate it. All the optimizations in LLVM
carry over into asm.js when "Emscriptened", generating highly efficient code.
The JS engine then can emit straight asm (actual asm this time, not asm.js)
based on the output of Emscripten, and reach near-native execution speeds, all
inside the browser!

[3]: https://github.com/kripken/emscripten/wiki

## LL(cool)JS

What asm.js does is fantastic. What it doesn't do is make our POJS (plain ol'
JavaScript, you heard it here first, folks!) faster. It's not a magic sauce
that suddenly makes regular, hard-working, hand-written JavaScript run fast.
But there is further research work underway to gain the advantages of asm.js in
JS, or something close to it.

[LLJS][6] is a language very similar to JavaScript, except for the major
difference that it is strongly typed. This extra type restriction is the
restriction necessary to gain a lot of performance optimizations. Due to that,
there is work underway to get [LLJS to compile into asm.js][4].

There are some problems on that front though:

1. LLJS is not JS. It's not the same language and you can't write it the same
   way.
2. LLJS is not stable. The language itself is changing.
3. Calling asm.js from non-asm.js context is pretty slow right now. See [this
   jsperf][5].
4. Interaction with normal JavaScript is extremely limited.

Part of these restrictions are LLJS, parts are asm.js. Currently, the way the
asm.js spec is laid out, the best way to make use of asm.js is to have
everything inside the asm.js context. Normal JavaScript can be used to kick it
off, perhaps, but the boundary tax between asm.js context and normal JS makes
integrating with existing code entirely not worth it.

LLJS, on the other hand, still has linguistic boundaries to being able to emit
asm.js while still being general enough a language to offer features that are
not possible under straight asm.js. It should make the interaction between
asm.js and normal JS seamless for it to be of significant value to be adopted.

[4]: http://jlongster.com/Compiling-LLJS-to-asm.js,-Now-Available-
[5]: http://jsperf.com/mathasm-vs-ternary/3
[6]: http://lljs.org/

## Fermata

It is important to keep in mind that all these languages and tools in the end
emit JavaScript: the same language that will run in existing browsers, existing
JS engines. The only difference is performance. JavaScript is a flexible enough
language to allow for all this shenaniganery yet remain exactly the same. What
this portends is that the groundwork is being laid for a web that is as good a
platform as any compiled language, but with the benefit of being distributable
through the web, sandboxed by the browser, with liberty and justice for all.

(╯°□°)╯︵ ┻━┻
