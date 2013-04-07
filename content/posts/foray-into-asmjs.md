The state of asm.js is that it's only a research topic for now. The only
runtime supporting asm.js is the latest SpiderMonkey, currently only available
in Firefox Nightly. But the gain is the ability to run code at nearly native
speeds: usually within 100% of natively compiled C.

The restriction is that asm.js follows a much stricter subset of rules which,
though technically valid as JavaScript, is extremely tedious to hand-craft.
It uses annotations such as x|0 or +x to coerce values into ints or
doubles. By the way, the only operations available inside asm.js context
are mathematical operations on signed/unsigned ints and doubles. No
strings, no objects, no memory management. Memory is intended to be
manually managed, the overall pool of which is requested once as a typed
array (e.g. Int32Array).

Now if this sounds super restrictive, it's intent is to be a way to translate
directly into compiled machine code. The asm.js compiler checks the module for
conformance to the asm.js spec; if it validates, the code becomes immediately
compiled without having to trace (TraceMonkey), infer types (TI), or incur
garbage collection (Compartmental GC), all areas of JS engine specialization
that deal with the dynamic nature of JS.

Just so it's clear, asm.js is not JS. You are not writing the same language at
all. However, asm.js is JS. It doesn't need a special runtime or plugins. It is
simply taking the dynamicness out of JS and turning it into a statically typed,
manual memory managed language.
