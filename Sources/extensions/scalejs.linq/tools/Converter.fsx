#r "Microsoft.JScript"

open System
open System.IO
open System.Text.RegularExpressions

module Seq = 
    let toString (sep : string) (vs : string[]) = String.Join(sep, vs)

let linqFile = sprintf "%s/../Scripts/linq.js" __SOURCE_DIRECTORY__
let lines = File.ReadAllLines(linqFile)
let staticMethods = lines 
                   |> Seq.takeWhile(fun line -> not(line.Contains("prototype")))
                   |> Seq.map (fun line -> (Regex(@"^\s*Enumerable\.(\w+).*function\s*\((.*)\)")).Match(line))
                   |> Seq.filter (fun m -> m.Success)
                   |> Seq.map (fun m -> m.Groups.[1].Value, m.Groups.[2].Value)
                   |> Seq.toArray

let instanceMethods = lines
                     |> Seq.takeWhile (fun line -> not(line.Contains("var Functions =")))
                     |> Seq.map (fun line -> (Regex(@"^\s*(\w+)\s*:\s*function\s*\((.*)\)")).Match(line))
                     |> Seq.filter (fun m -> m.Success)
                     |> Seq.map (fun m -> m.Groups.[1].Value, m.Groups.[2].Value)
                     |> Seq.toArray

type MethodScope = Static | Instance

let convert scope methods = 
    let indent = match scope with | Static -> "    " | Instance -> "        "

    methods |> Seq.map (fun (f,ps) -> 
                (match f with 
                 | "Return" -> "returnValue"
                 | "Do" -> "doAction"
                 | "Catch" -> "catchException"
                 | "Finally" -> "finallyAction"
                 | _ -> f),ps)
            |> Seq.map (fun (f,ps) -> Regex.Replace(f, "(^[A-Z])", fun (m : Match) -> m.Value.ToLower()), f, ps)
            |> Seq.collect (fun (fc,fp,ps) ->
                    let target,instance = 
                        match scope with 
                        | Static -> fp, "null"
                        | Instance -> "prototype." + fp, "linqEnumerable"
                    match fc with
                    | "all" 
                    | "any"
                    | "contains"
                    | "sequenceEqual"
                    | "aggregate"
                    | "average"
                    | "count" 
                    | "max" 
                    | "min" 
                    | "maxBy" 
                    | "minBy" 
                    | "sum" 
                    | "indexOf" 
                    | "lastIndexOf" 
                    | "toArray"
                    | "toObject"
                    | "toLookup"
                    | "toDictionary"
                    | "toJSON"
                    | "toString" ->
                        [sprintf "e.%s = function (%s) {" fc ps
                         sprintf "    return Enumerable.%s.apply(%s, arguments);" target instance
                         "};\n"] 
                    | _ when fc.StartsWith("elementAt") ||
                             fc.StartsWith("first") ||
                             fc.StartsWith("last") ||
                             fc.StartsWith("single") ->
                        [sprintf "e.%s = function (%s) {" fc ps
                         sprintf "    return Enumerable.%s.apply(%s, arguments);" target instance
                         "};\n"] 
                    | "forEach" 
                    | "write"
                    | "writeLine" 
                    | "force" ->
                        [sprintf "e.%s = function (%s) {" fc ps
                         sprintf "    Enumerable.%s.apply(%s, arguments);" target instance
                         "};\n"]
                    | "let" ->
                        [sprintf "e.letBind = function (bindFunc) {"
                         sprintf "    return enumerable(linqEnumerable.Let(function (le) {"
                         sprintf "        var result = bindFunc(enumerable(le));"
                         sprintf "        return result.unwrap();"
                         sprintf "    }));"
                         sprintf "};\n"]
                    | "zip" ->
                        [sprintf "e.zip = function (source, selector) {"
                         sprintf "    var le = source.unwrap();"
                         sprintf "    return enumerable(linqEnumerable.Zip(le, selector));"
                         sprintf "};\n"]
                    | _ -> 
                        [sprintf "e.%s = function (%s) {" fc ps
                         sprintf "    return enumerable(Enumerable.%s.apply(%s, arguments));" target instance
                         "};\n"])
            |> Seq.map (fun s -> if not(System.String.IsNullOrWhiteSpace(s)) then indent + s else s)
            |> Seq.toArray

let staticText = staticMethods |> convert Static |> Seq.toString "\n"
let instanceText = instanceMethods |> convert Instance |> Seq.toString "\n"

let path = Path.Combine(__SOURCE_DIRECTORY__, "../scalejs.linq/enumerable.js")
let content = 
    sprintf "// ReSharper disable InconsistentNaming, DuplicatingLocalDeclaration, UnusedParameter\n/*global define */\n/*jslint unparam: true*/
define([ 'linq' ], function (Enumerable) {
    'use strict';

    function enumerable(linqEnumerable) {
        var e = {};

        e.unwrap = function () { return linqEnumerable; };

%s
        return e;
    }

    var e = {};

%s
    return e;
});" instanceText staticText    
File.WriteAllText(path, content)