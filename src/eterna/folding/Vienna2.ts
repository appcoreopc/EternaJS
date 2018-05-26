// import { Folder } from "./Folder";
//
// // There can be only one statically linked Alchemy library.
// // Consequently, this next instance must be loaded dynamically.
// //
// // FIXME: there's way too much code duplication with Vienna.as
// //        should refactor
//
// export class Vienna2 extends Folder {
// 	public static NAME: string = "Vienna2";
//
// 	private _ldr:Loader;
// 	private _lib:Object;
//
// 	constructor(loaded_cb:Function = null) {
// 		super(loaded_cb);
// 		this._lib = null;
// 		this._ldr = new Loader();
// 		this._ldr.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, this.on_complete);
// 		this._ldr.contentLoaderInfo.addEventListener(Event.COMPLETE, this.on_complete);
// 		let ctx:LoaderContext = new LoaderContext();
// 		ctx.applicationDomain = new ApplicationDomain();
// 		let url:string = Application.instance.get_url_base() + "/eterna_resources/vrna2.swf";
// 		this._ldr.load(new URLRequest(url), ctx);
// 	}
//
// 	private on_complete(e:Event):void {
// 		let cls:Object = null;
// 		if (e.type != IOErrorEvent.IO_ERROR) {
// 			try {
// 				cls = (<Class>this._ldr.contentLoaderInfo.applicationDomain.getDefinition("cmodule.vrna2.CLibInit") );
// 			} catch (e:Error) {
// 				throw new IllegalOperationError("CLibInit definition not found in vrna2.swf");
// 			}
// 		}
//
// 		if (cls != null) {
// 			this._clib_inst = new cls();
// 			this._lib = this._clib_inst.init();
// 			this._functional = true;
// 		}
// 		this.on_loaded();
// 	}
//
// 	private fold_sequence_alch(seq:any[], str:string = null, temp:number = 37):any[] {
//
// 		let leng:number = seq.length;
// 		let x:number;
// 		let seqRet:any[];
// 		let seqStr:string = "";
// 		let structStr:string = "";
//
//
// 		if(str == null)
// 			structStr = "";
// 		else
// 			structStr = str;
//
// 		seqStr = "";
// 		for (x = 0; x < leng; x++) {
//
// 			switch (seq[x]) {
// 				case EPars.RNABASE_ADENINE:
// 					seqStr += "A";
// 					break;
// 				case EPars.RNABASE_CYTOSINE:
// 					seqStr += "C";
// 					break;
// 				case EPars.RNABASE_GUANINE:
// 					seqStr += "G";
// 					break;
// 				case EPars.RNABASE_URACIL:
// 					seqStr += "U";
// 					break;
// 				default:
// 					trace("bad nucleotide");
// 			}
// 		}
//
// 		seqRet = this._lib.fullAlchFold(1, new Array(temp.toString()), seqStr, structStr);
// 		trace("done folding");
// 		return EPars.parenthesis_to_pair_array(seqRet[1]);
//
// 	}
//
// 	private fold_sequence_alch_with_binding_site(seq:any[], i:number, p:number, j:number, q:number, bonus:number, temp:number=37):any[] {
// 		let leng:number = seq.length;
// 		let x:number;
// 		let seqRet:any[];
// 		let seqStr:string = "";
// 		let structStr:string = "";
//
// 		seqStr = "";
// 		for (x = 0; x < leng; x++) {
//
// 			switch (seq[x]) {
// 				case EPars.RNABASE_ADENINE:
// 					seqStr += "A";
// 					break;
// 				case EPars.RNABASE_CYTOSINE:
// 					seqStr += "C";
// 					break;
// 				case EPars.RNABASE_GUANINE:
// 					seqStr += "G";
// 					break;
// 				case EPars.RNABASE_URACIL:
// 					seqStr += "U";
// 					break;
// 				default:
// 					trace("bad nucleotide");
// 			}
// 		}
// 		/// type "3" for switch fold
// 		seqRet = this._lib.fullAlchFold(3, [i+1,p+1,j+1,q+1, -bonus], seqStr, structStr);
//
// 		return EPars.parenthesis_to_pair_array(seqRet[1]);
// 	}
//
// 	private cofold_sequence_alch(seq:any[], str:string = null, temp:number = 37):any[] {
//
// 		let leng:number = seq.length;
// 		let x:number;
// 		let seqRet:any[];
// 		let seqStr:string = "";
// 		let structStr:string = "";
//
//
// 		if(str == null)
// 			structStr = "";
// 		else
// 			structStr = str;
//
// 		seqStr = "";
// 		for (x = 0; x < leng; x++) {
//
// 			switch (seq[x]) {
// 				case EPars.RNABASE_CUT:
// 					seqStr += "&";
// 					break;
// 				case EPars.RNABASE_ADENINE:
// 					seqStr += "A";
// 					break;
// 				case EPars.RNABASE_CYTOSINE:
// 					seqStr += "C";
// 					break;
// 				case EPars.RNABASE_GUANINE:
// 					seqStr += "G";
// 					break;
// 				case EPars.RNABASE_URACIL:
// 					seqStr += "U";
// 					break;
// 				default:
// 					trace("bad nucleotide");
// 			}
// 		}
//
// 		seqRet = this._lib.fullAlchFold(4, [temp.toString()], seqStr, structStr);
// 		trace("done cofolding");
// 		return EPars.parenthesis_to_pair_array(seqRet[1]);
//
// 	}
//
// 	private cofold_sequence_alch_with_binding_site(seq:any[], str:string, i:number, p:number, j:number, q:number, bonus:number, temp:number=37):any[] {
//
// 		let leng:number = seq.length;
// 		let x:number;
// 		let seqRet:any[];
// 		let seqStr:string = "";
// 		let structStr:string = "";
//
//
// 		if(str == null)
// 			structStr = "";
// 		else
// 			structStr = str;
//
// 		seqStr = "";
// 		for (x = 0; x < leng; x++) {
//
// 			switch (seq[x]) {
// 				case EPars.RNABASE_CUT:
// 					seqStr += "&";
// 					break;
// 				case EPars.RNABASE_ADENINE:
// 					seqStr += "A";
// 					break;
// 				case EPars.RNABASE_CYTOSINE:
// 					seqStr += "C";
// 					break;
// 				case EPars.RNABASE_GUANINE:
// 					seqStr += "G";
// 					break;
// 				case EPars.RNABASE_URACIL:
// 					seqStr += "U";
// 					break;
// 				default:
// 					trace("bad nucleotide");
// 			}
// 		}
//
// 		seqRet = this._lib.fullAlchFold(5, [i+1,p+1,j+1,q+1, -bonus], seqStr, structStr);
// 		trace("done cofolding_wbs");
// 		return EPars.parenthesis_to_pair_array(seqRet[1]);
//
// 	}
//
// 	private fold_sequence_alch_with_binding_site_old(seq:any[], target_pairs:any[], binding_site:any[], bonus:number, temp:number=37):any[] {
// 		let best_pairs:any[];
// 		let native_pairs:any[] = this.fold_sequence(seq,null,null);
//
// 		let native_tree:RNALayout = new RNALayout();
// 		native_tree.setup_tree(native_pairs);
// 		native_tree.score_tree(seq,this);
// 		let native_score:number = native_tree.get_total_score();
//
// 		let target_satisfied:any[] = EPars.get_satisfied_pairs(target_pairs,seq);
// 		let target_tree:RNALayout = new RNALayout();
// 		target_tree.setup_tree(target_satisfied);
// 		target_tree.score_tree(seq,this);
// 		let target_score:number = target_tree.get_total_score();
//
//
// 		let native_bound:boolean = true;
// 		let target_bound:boolean = true;
//
// 		for (let bb:number=0; bb<binding_site.length; bb++) {
// 			let bi:number = binding_site[bb];
// 			if(target_pairs[bi] != native_pairs[bi]) {
// 				native_bound = false;
// 			}
//
// 			if(target_pairs[bi] != target_satisfied[bi]) {
// 				target_bound = false;
// 			}
// 		}
//
// 		if (target_bound) {
// 			target_score += bonus;
// 		}
//
// 		if (native_bound) {
// 			native_score += bonus;
// 		}
//
// 		if(target_score < native_score) {
// 			best_pairs = target_satisfied;
// 		} else {
// 			best_pairs = native_pairs;
// 		}
//
// 		return best_pairs;
// 	}
//
//
// 	/*override*/ public can_dot_plot():boolean {
// 		return true;
// 	}
//
// 	/*override*/ public get_dot_plot(seq:any[], pairs:any[], temp:number=37):any[] {
//
// 		let key:Object = {primitive:"dotplot", seq:seq, pairs:pairs, temp:temp};
// 		let ret_array:any[] = this.get_cache(key);
// 		if (ret_array != null) {
// 			trace("dotplot cache hit");
// 			return ret_array.slice();
// 		}
//
// 		let leng:number = seq.length;
// 		let prob_str:string = "";
// 		let secstruct_str:string = EPars.pairs_array_to_parenthesis(pairs);
// 		let struct_str:string ="";
// 		let seq_str:string = EPars.sequence_array_to_string(seq);
//
// 		let seq_ret:any[] = this._lib.fullAlchFold(2, [temp.toString(), prob_str, secstruct_str], seq_str, struct_str);
// 		let temp_array:any[] = CSVParser.parse_into_array_with_white_spaces(seq_ret[2]);
// 		ret_array = [];
//
// 		if(temp_array.length % 4 != 0) {
// 			throw new Error("Something's wrong with dot plot return " + temp_array.length);
// 			return null;
// 		}
//
// 		for(let ii:number=0; ii<temp_array.length; ii+=4) {
// 			if(temp_array[ii+3] == "ubox") {
// 				ret_array.push(temp_array[ii]);
// 				ret_array.push(temp_array[ii+1]);
// 				ret_array.push(temp_array[ii+2]);
// 			} else {
// 				ret_array.push(temp_array[ii+1]);
// 				ret_array.push(temp_array[ii]);
// 				ret_array.push(temp_array[ii+2]);
// 			}
// 		}
//
// 		this.put_cache(key, ret_array.slice());
// 		return ret_array;
// 	}
//
// 	/*override*/ public get_folder_name():string {
// 		return Vienna2.NAME;
// 	}
//
// 	/*override*/ public can_score_structures():boolean {
// 		return true;
// 	}
//
// 	/*override*/ public score_structures(seq:any[], pairs:any[], temp:number = 37, nodes:any[] = null):number {
// 		let key:Object = {primitive:"score", seq:seq, pairs:pairs, temp:temp};
// 		let result:Object = this.get_cache(key);
// 		let ii :number;
//
// 		if (result != null) {
// 			// trace("score cache hit");
// 			if (nodes != null) {
// 				for (ii = 0; ii < result.nodes.length; ii++) nodes.push(result.nodes[ii]);
// 			}
// 			return result.ret[0] * 100;
// 		}
//
// 		let ret:any[] = this._lib.fullAlchEval(temp, EPars.sequence_array_to_string(seq), EPars.pairs_array_to_parenthesis(pairs), nodes);
//
// 		let cut:number = seq.indexOf(EPars.RNABASE_CUT);
// 		if (cut >= 0 && nodes != null && nodes[0] != -2) {
// 			// we just scored a duplex that wasn't one, so we have to redo it properly
// 			let seqA:any[] = seq.slice(0, cut);
// 			let pairsA:any[] = pairs.slice(0, cut);
// 			let nodesA:any[] = [];
// 			let retA:number = this.score_structures(seqA, pairsA, temp, nodesA);
//
// 			let seqB:any[] = seq.slice(cut+1);
// 			let pairsB:any[] = pairs.slice(cut+1);
// 			for (ii = 0; ii < pairsB.length; ii++) {
// 				if (pairsB[ii] >= 0) pairsB[ii] -= (cut+1);
// 			}
// 			let nodesB:any[] = [];
// 			let retB:number = this.score_structures(seqB, pairsB, temp, nodesB);
//
// 			if (nodesA[0] != -1 || nodesB[0] != -1) {
// 				throw new Error("Something went terribly wrong in score_structures()");
// 			}
//
// 			nodes.splice(0); // make empty
// 			for (ii = 0; ii < nodesA.length; ii++) nodes[ii] = nodesA[ii];
// 			nodes[1] += nodesB[1]; // combine the free energies of the external loops
// 			for (ii = 2; ii < nodesB.length; ii += 2) {
// 				nodes.push(nodesB[ii] + cut+1);
// 				nodes.push(nodesB[ii+1]);
// 			}
//
// 			ret[0] = (retA + retB) / 100;
// 		}
//
// 		if (nodes != null) {
// 			result = {ret:ret.slice(), nodes:nodes.slice()};
// 			this.put_cache(key, result);
// 		}
//
// 		return ret[0] * 100;
// 	}
//
// 	/*override*/ public fold_sequence(seq:any[], second_best_pairs:any[], desired_pairs:string = null, temp:number = 37):any[] {
// 		let key:Object = {primitive:"eterna.folding", seq:seq, second_best_pairs:second_best_pairs, desired_pairs:desired_pairs, temp:temp};
// 		let pairs:any[] = this.get_cache(key);
// 		if (pairs != null) {
// 			// trace("fold cache hit");
// 			return pairs.slice();
// 		}
//
// 		pairs = this.fold_sequence_alch(seq, desired_pairs, temp);
// 		this.put_cache(key, pairs.slice());
// 		return pairs;
// 	}
//
// 	/*override*/ public fold_sequence_with_binding_site(seq:any[], target_pairs:any[], binding_site:any[], bonus:number, version:number = 1.0, temp:number = 37):any[] {
//
// 		let key:Object = {primitive:"fold_aptamer", seq:seq, target_pairs:target_pairs, binding_site:binding_site, bonus:bonus, version:version, temp:temp};
// 		let pairs:any[] = this.get_cache(key);
// 		if (pairs != null) {
// 			// trace("fold_aptamer cache hit");
// 			return pairs.slice();
// 		}
//
// 		if (!(version >= 2.0)) {
// 			pairs = this.fold_sequence_alch_with_binding_site_old(seq, target_pairs, binding_site, bonus);
// 			this.put_cache(key, pairs.slice());
// 			return pairs;
// 		}
//
// 		let site_groups:any[] = [];
// 		let last_index:number = -1;
// 		let current_group:any[] = [];
//
// 		for (let jj:number = 0; jj < binding_site.length; jj++) {
// 			if (last_index < 0 || binding_site[jj] - last_index  == 1) {
// 				current_group.push(binding_site[jj]);
// 				last_index = binding_site[jj];
// 			} else {
// 				site_groups.push(current_group);
// 				current_group = [];
// 				current_group.push(binding_site[jj]);
// 				last_index = binding_site[jj];
// 			}
// 		}
// 		if (current_group.length > 0) {
// 			site_groups.push(current_group);
// 		}
//
// 		if (site_groups.length == 2)
// 			pairs = this.fold_sequence_alch_with_binding_site(seq, site_groups[0][0], site_groups[0][site_groups[0].length-1], site_groups[1][site_groups[1].length-1], site_groups[1][0], bonus, temp);
// 		else
// 			pairs = this.fold_sequence_alch_with_binding_site_old(seq, target_pairs, binding_site, bonus);
//
// 		this.put_cache(key, pairs.slice());
// 		return pairs;
// 	}
//
// 	/*override*/ public can_cofold():boolean {
// 		return true;
// 	}
//
// 	/*override*/ public cofold_sequence(seq:any[], second_best_pairs:any[], malus:number = 0, desired_pairs:string = null, temp:number = 37):any[] {
// 		let cut:number = seq.indexOf(EPars.RNABASE_CUT);
// 		if (cut < 0) {
// 			throw new Error("Missing cutting point");
// 		}
//
// 		let key:Object = {primitive:"cofold", seq:seq, second_best_pairs:second_best_pairs, malus:malus, desired_pairs:desired_pairs, temp:temp};
// 		let co_pairs:any[] = this.get_cache(key);
// 		if (co_pairs != null) {
// 			// trace("cofold cache hit");
// 			return co_pairs.slice();
// 		}
//
// 		// FIXME: what about desired_pairs? (forced structure)
// 		let seqA:any[] = seq.slice(0, cut);
// 		let pairsA:any[] = this.fold_sequence(seqA, null, null, temp);
// 		let nodesA:any[] = [];
// 		let feA:number = this.score_structures(seqA, pairsA, temp, nodesA);
//
// 		let seqB:any[] = seq.slice(cut+1);
// 		let pairsB:any[] = this.fold_sequence(seqB, null, null, temp);
// 		let nodesB:any[] = [];
// 		let feB:number = this.score_structures(seqB, pairsB, temp, nodesB);
//
// 		co_pairs = this.cofold_sequence_alch(seq, desired_pairs, temp);
// 		let co_nodes:any[] = [];
// 		let co_fe:number = this.score_structures(seq, co_pairs, temp, co_nodes);
//
// 		if (co_fe + malus >= feA + feB) {
// 			let struc:string = EPars.pairs_array_to_parenthesis(pairsA) + "&" + EPars.pairs_array_to_parenthesis(pairsB);
// 			co_pairs = EPars.parenthesis_to_pair_array(struc);
// 		}
//
// 		this.put_cache(key, co_pairs.slice());
// 		return co_pairs;
// 	}
//
// 	/*override*/ public can_cofold_with_binding_site():boolean {
// 		return true;
// 	}
//
// 	private binding_site_formed(pairs:any[], groups:any[]):boolean {
// 		if (pairs[groups[0][0]] != groups[1][groups[1].length-1]) return false;
// 		if (pairs[groups[0][groups[0].length-1]] != groups[1][0]) return false;
// 		let ii:number;
// 		for (ii = 1; ii < groups[0].length-1; ii++)
// 			if (pairs[groups[0][ii]] != -1) return false;
// 		for (ii = 1; ii < groups[1].length-1; ii++)
// 			if (pairs[groups[1][ii]] != -1) return false;
//
// 		return true;
// 	}
//
// 	/*override*/ public cofold_sequence_with_binding_site(seq:any[], binding_site:any[], bonus:number, desired_pairs:string = null, malus:number = 0, temp:number = 37):any[] {
// 		let cut:number = seq.indexOf(EPars.RNABASE_CUT);
// 		if (cut < 0) {
// 			throw new Error("Missing cutting point");
// 		}
//
// 		let key:Object = {primitive:"cofold_aptamer", seq:seq, malus:malus, desired_pairs:desired_pairs, binding_site:binding_site, bonus:bonus, temp:temp};
// 		let co_pairs:any[] = this.get_cache(key);
// 		if (co_pairs != null) {
// 			// trace("cofold_aptamer cache hit");
// 			return co_pairs.slice();
// 		}
//
// 		// IMPORTANT: assumption is that the binding site is in segment A
// 		// FIXME: what about desired_pairs? (forced structure)
//
// 		let site_groups:any[] = [];
// 		let last_index:number = -1;
// 		let current_group:any[] = [];
//
// 		for (let jj:number = 0; jj < binding_site.length; jj++) {
// 			if (last_index < 0 || binding_site[jj] - last_index == 1) {
// 				current_group.push(binding_site[jj]);
// 				last_index = binding_site[jj];
// 			} else {
// 				site_groups.push(current_group);
// 				current_group = [];
// 				current_group.push(binding_site[jj]);
// 				last_index = binding_site[jj];
// 			}
// 		}
// 		if (current_group.length > 0) {
// 			site_groups.push(current_group);
// 		}
//
// 		let seqA:any[] = seq.slice(0, cut);
// 		let pairsA:any[] = this.fold_sequence_with_binding_site(seqA, null, binding_site, bonus, 2.5, temp);
// 		let nodesA:any[] = [];
// 		let feA:number = this.score_structures(seqA, pairsA, temp, nodesA);
// 		if (this.binding_site_formed(pairsA, site_groups)) feA += bonus;
//
// 		let seqB:any[] = seq.slice(cut+1);
// 		let pairsB:any[] = this.fold_sequence(seqB, null, null, temp);
// 		let nodesB:any[] = [];
// 		let feB:number = this.score_structures(seqB, pairsB, temp, nodesB);
//
// 		co_pairs = this.cofold_sequence_alch_with_binding_site(seq, desired_pairs, site_groups[0][0], site_groups[0][site_groups[0].length-1], site_groups[1][site_groups[1].length-1], site_groups[1][0], bonus, temp);
// 		let co_nodes:any[] = [];
// 		let co_fe:number = this.score_structures(seq, co_pairs, temp, co_nodes);
// 		if (this.binding_site_formed(co_pairs, site_groups)) co_fe += bonus;
//
// 		if (co_fe + malus >= feA + feB) {
// 			let struc:string = EPars.pairs_array_to_parenthesis(pairsA) + "&" + EPars.pairs_array_to_parenthesis(pairsB);
// 			co_pairs = EPars.parenthesis_to_pair_array(struc);
// 		}
//
// 		this.put_cache(key, co_pairs.slice());
// 		return co_pairs;
// 	}
//
// 	/*override*/ public load_custom_params():boolean {
// 		if (this._lib != null && this._lib.hasOwnProperty("loadParams")) {
// 			let success:boolean = (this._lib.loadParams("custom.par") == 0);
// 			if (success) this.reset_cache();
// 			return success;
// 		}
// 		return false;
// 	}
//
// //
// // FIXME: everything below this line is now unused...
// //
//
// 	/*override*/ public ml_energy(pairs:any[], S:any[], i:number, is_extloop:boolean):number {
//
// 		let energy :number, cx_energy :number, best_energy:number;
// 		best_energy = EPars.INF;
// 		let i1 :number, j :number, p :number, q :number, u :number, x :number, type :number, count:number;
// 		let mlintern:any[] = new Array(EPars.NBPAIRS+1);
// 		let mlclosing :number, mlbase:number;
//
// 		let dangles:number = EPars.DANGLES;
//
// 		if (is_extloop) {
// 			for (x = 0; x <= EPars.NBPAIRS; x++) {
// 				mlintern[x] = EPars.ml_intern(x)- EPars.ml_intern(1); /* 0 or TerminalAU */
// 			}
//
// 			mlclosing = mlbase = 0;
// 		} else {
// 			for (x = 0; x <= EPars.NBPAIRS; x++) {
// 				mlintern[x] = EPars.ml_intern(x);
// 			}
//
// 			mlclosing = EPars.ML_CLOSING37;
// 			mlbase = EPars.ML_BASE37;
// 		}
//
// 		for (count=0; count<2; count++) { /* do it twice */
// 			let ld5:number = 0; /* 5' dangle energy on prev pair (type) */
// 			if ( i == 0 ) {
// 				j = pairs[0] + 1;
// 				type = 0;  /* no pair */
// 			} else {
// 				j = pairs[i];
// 				type = EPars.pair_type(S[j],S[i]);
//
// 				if (type==0) {
// 					type=7;
// 				}
// 			}
// 			i1=i; p = i+1; u=0;
// 			energy = 0; cx_energy = EPars.INF;
//
// 			do { /* walk around the multi-loop */
// 				let tt :number, new_cx:number;
// 				new_cx = EPars.INF;
//
// 				/* hope over unpaired positions */
// 				while (p <= pairs[0] && pairs[p] == 0) p++;
//
// 				/* memorize number of unpaired positions */
// 				u += p-i1-1;
// 				/* get position of pairing partner */
// 				if ( p == pairs[0] + 1 ) {
// 					q  = tt = 0; /* virtual root pair */
// 				} else {
// 					q  = pairs[p];
// 					/* get type of base pair P->q */
// 					tt = EPars.pair_type(S[p], S[q]);
// 					if (tt==0) tt=7;
// 				}
//
// 				energy += mlintern[tt];
// 				cx_energy += mlintern[tt];
//
// 				if (dangles) {
// 					let dang5:number = 0;
// 					let dang3:number = 0;
// 					let dang:number = 0;
// 					if ((p > 1)) {
// 						dang5 = EPars.get_dangle5_score(tt, S[p-1]);      /* 5'dangle of pq pair */
// 					}
// 					if ((i1 < S[0])) {
// 						dang3 = EPars.get_dangle3_score(type, S[i1+1]); /* 3'dangle of previous pair */
// 					}
//
// 					switch (p-i1-1) {
// 						case 0: /* adjacent helices *this./* adjacent helices */	case 1: /* 1 unpaired base between helices *this./* 1 unpaired base between helices */dang = (dangles==2)?(dang3+dang5):Math.min(dang3, dang5);
// 							energy += dang;
// 							break;
//
// 						default: /* many unpaired base between helices *this./* many unpaired base between helices */energy += dang5 +dang3;
//
// 					}
// 					type = tt;
// 				}
//
// 				i1 = q; p=q+1;
// 			} while (q!=i);
//
// 			best_energy = Math.min(energy, best_energy); /* don't use cx_energy here */
//
// 			if (dangles!=3 || is_extloop)  {
// 				break;  /* may break cofold with co-ax */
// 			}
// 			/* skip a helix and start again */
// 			while (pairs[p] == 0) {
// 				p++;
// 			}
// 			if (i == pairs[p]) break;
// 			i = pairs[p];
// 		}
//
// 		energy = best_energy;
// 		energy += mlclosing;
//
// 		energy += mlbase*u;
//
// 		return energy;
// 	}
//
// 	/*override*/ public cut_in_loop(i:number):number {
// 		return 0;
// 	}
//
// 	/*override*/ public loop_energy(n1:number, n2:number, type:number, type_2:number, si1:number, sj1:number, sp1:number, sq1:number, b1:boolean, b2:boolean):number {
//
// 		let loop_score:number = 0;
//
// 		/* compute energy of degree 2 loop (stack bulge or interior) */
// 		let nl :number, ns:number;
//
// 		if (n1>n2) { nl=n1; ns=n2;}
// 		else {nl=n2; ns=n1;}
//
// 		if (nl == 0) {
// 			return EPars.get_stack_score(type , type_2, b1, b2);    /* stack */
// 		}
//
// 		if (ns==0) {                       /* bulge */
// 			if (nl<= EPars.MAXLOOP) {
// 				loop_score = EPars.bulge37[nl];
// 			} else {
// 				loop_score = EPars.get_bulge(nl);
// 			}
// 			if (nl==1) {
// 				loop_score += EPars.get_stack_score(type , type_2, b1, b2);
// 			} else {
// 				if (type>2) {
// 					loop_score += EPars.TERM_AU;
// 				}
// 				if (type_2>2) {
// 					loop_score += EPars.TERM_AU;
// 				}
// 			 }
// 			return loop_score;
// 		} else {                             /* interior loop */
//
// 			if (ns==1) {
// 				if (nl==1)                     // 1x1 loop
// 					return EPars.get_int11(type,type_2,si1,sj1);
//
// 				if (nl==2) {                   // 2x1 loop
// 					if (n1==1)
// 						loop_score = EPars.get_int21(type,type_2,si1,sq1,sj1);
// 					else
// 						loop_score = EPars.get_int21(type_2,type,sq1,si1,sp1);
//
// 					return loop_score;
// 				}
// 			} else if (n1==2 && n2==2)         // 2x2 loop
// 				return EPars.get_int22(type, type_2, si1, sp1, sq1, sj1);
//
// 			{
// 				/* generic interior loop (no else here!)*/
// 				if((n1+n2<=EPars.MAXLOOP)) {
// 					loop_score = EPars.internal37[n1 + n2];
// 				} else {
// 					loop_score = EPars.get_internal(n1+n2);
// 				}
//
// 				loop_score += Math.min(EPars.MAX_NINIO, (nl-ns) * EPars.F_ninio37[2]);
// 				loop_score += EPars.internal_mismatch(type,si1,sj1)+ EPars.internal_mismatch(type_2,sq1,sp1);
//
// 			}
// 		}
//
//
// 		return loop_score;
//
//
// 	}
//
// 	/*override*/ public hairpin_energy(size:number, type:number, si1:number, sj1:number, sequence:any[], i:number, j:number):number {
//
// 		let hairpin_score:number = 0;
//
// 		if(size <= 30) {
// 			hairpin_score = EPars.hairpin37[size];
// 		} else {
// 			hairpin_score = EPars.hairpin37[30]+ Number(EPars.LXC * Math.log((size)/30.));
//
// 		}
//
// 		if (size == 4) {
//
// 			let loop_str:string = "";
// 			for(let walker:number = i; walker<=j; walker++) {
// 				if(sequence[walker] == EPars.RNABASE_ADENINE) {
// 					loop_str += "A";
// 				} else if(sequence[walker] == EPars.RNABASE_GUANINE) {
// 					loop_str += "G";
// 				} else if(sequence[walker] == EPars.RNABASE_URACIL) {
// 					loop_str += "U";
// 				} else if(sequence[walker] == EPars.RNABASE_CYTOSINE) {
// 					loop_str += "C";
// 				}
// 			}
//
// 			hairpin_score += EPars.get_tetra_loop_bonus(loop_str);
// 		}
//
// 		if (size == 3) {
// 			if(type > 2)
// 				hairpin_score += EPars.TERM_AU;
//
// 		} else {
// 			hairpin_score += EPars.hairpin_mismatch(type,si1,sj1);
// 		}
//
// 		return hairpin_score;
//
// 	}
//
// }