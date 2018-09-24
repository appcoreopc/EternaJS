import {Container, Graphics, Point, Text} from "pixi.js";
import {Flashbang} from "../../../flashbang/core/Flashbang";
import {ContainerObject} from "../../../flashbang/objects/ContainerObject";
import {TextBuilder} from "../../../flashbang/util/TextBuilder";
import {Feedback} from "../../Feedback";
import {Solution} from "../../puzzle/Solution";
import {GameButton} from "../../ui/GameButton";
import {TextInputObject} from "../../ui/TextInputObject";
import {Fonts} from "../../util/Fonts";
import {int} from "../../util/int";
import {Utility} from "../../util/Utility";
import {DesignBrowserColumnName, DesignBrowserDataType} from "./DesignBrowserMode";
import {SequenceBoard} from "./SequenceBoard";
import {SortOrder} from "./SortOrder";

export type SortFunction = (sortCategory: string, sortOrder: SortOrder, sortArgs?: any[]) => void;
export type ReorganizeFunction = (sort: boolean) => void;

export class DataCol extends ContainerObject {
    constructor(data_type: DesignBrowserDataType, exp: string,
                data_width: number, fonttype: string,
                fontSize: number, sortable: boolean) {
        super();

        this._data_type = data_type;
        this._columnName = exp;
        this._data_width = data_width;
        this._fontType = fonttype;
        this._fontSize = fontSize;
        this._sortable = sortable;
    }

    protected added(): void {
        super.added();

        this._graphics = new Graphics();
        this.container.addChild(this._graphics);

        let dataDisplayBuilder = new TextBuilder().font(this._fontType).fontSize(this._fontSize).color(0xffffff);
        this._line_height = dataDisplayBuilder.computeLineHeight();

        this._dataDisplay = dataDisplayBuilder.build();
        // this._dataDisplay.set_text("A\nA");
        // let metr: TextLineMetrics = this._dataDisplay.GetTextBox().getLineMetrics(0);
        // this._line_height = metr.height + metr.leading / 2;
        this._dataDisplay.position = new Point(11, DataCol.DATA_H);
        this.container.addChild(this._dataDisplay);

        this._sequence_board = new SequenceBoard(this._fontType, this._fontSize, true, this._fontSize, this._line_height);
        this._sequence_board.display.position = new Point(0, DataCol.DATA_H);
        this.addObject(this._sequence_board, this.container);

        this._label = new GameButton().label(this._columnName, 14);
        this._label.display.position = new Point(11, 7);
        this.addObject(this._label, this.container);

        this._labelArrow = new Graphics();
        this._labelArrow.position = this._label.display.position;
        this.container.addChild(this._labelArrow);

        if (this._sortable) {
            this._label.clicked.connect(() => this.toggle_sort_state());
        }

        const TEXT_INPUT_SIZE = 13;

        if (this._data_type == DesignBrowserDataType.STRING) {
            this._input_field = new TextInputObject(TEXT_INPUT_SIZE, this._data_width - 22);
            this._input_field.display.position = new Point(11, 54);
            this.addObject(this._input_field, this.container);
            // this._input_field.addEventListener(KeyboardEvent.KEY_UP, this.handle_key_down);

            this._field_string = Fonts.arial("search", 14).color(0xffffff).build();
            this._field_string.position = new Point(11, 33);
            this.container.addChild(this._field_string);

        } else {
            this._input_field = new TextInputObject(TEXT_INPUT_SIZE, (this._data_width - 29) * 0.5);
            this._input_field.display.position = new Point(11, 54);
            this.addObject(this._input_field, this.container);
            // this._input_field.addEventListener(KeyboardEvent.KEY_UP, this.handle_key_down);

            this._field_string = Fonts.arial("min", 14).color(0xffffff).build();
            this._field_string.position = new Point(11, 33);
            this.container.addChild(this._field_string);

            this._input_field2 = new TextInputObject(TEXT_INPUT_SIZE, (this._data_width - 29) * 0.5);
            this._input_field2.display.position = new Point(11 + (this._data_width - 29) / 2 + 7, 54);
            this.addObject(this._input_field2, this.container);
            // this._input_field2.addEventListener(KeyboardEvent.KEY_UP, this.handle_key_down);

            this._field_string2 = Fonts.arial("max", 14).color(0xffffff).build();
            this._field_string2.position = new Point((this._data_width - 7) / 2 + 7, 33);
            this.container.addChild(this._field_string2);
        }

        this.updateLayout();
    }

    public setSize(width: number, height: number): void {
        if (this._width === width && this._height === height) {
            return;
        }

        this._width = width;
        this._height = height;
        if (this.isLiveObject) {
            this.updateLayout();
        }
    }

    private updateLayout(): void {
        this._num_display = int((this._height - 70 - 20) / this._line_height);
        this.display_data();
        this.set_column_color(this._col);
    }

    public set_pairs(pairs: number[]): void {
        this._pairs_array = pairs.slice();
    }

    private get mouseLoc(): Point {
        return this.container.toLocal(Flashbang.globalMouse);
    }

    public get_current_mouse_index(): number[] {
        let mouseLoc = this.mouseLoc;
        if (mouseLoc.y < DataCol.DATA_H) {
            return [0, DataCol.DATA_H - mouseLoc.y];
        }

        let ii = (mouseLoc.y - DataCol.DATA_H) / this._line_height;
        if (ii >= this._num_display) {
            return [this._num_display - 1, DataCol.DATA_H + (this._num_display - 1) * this._line_height - mouseLoc.y];
        }

        return [ii, DataCol.DATA_H + (ii * this._line_height) - mouseLoc.y];
    }

    public set_filter(filter1: string, filter2: string): void {
        this._input_field.text = filter1;
        if (filter2 != null) {
            this._input_field2.text = filter2;
        }
    }

    public set_sort_state(sortOrder: SortOrder): void {
        this._sortOrder = sortOrder;

        this._labelArrow.clear();
        if (this._sortOrder == SortOrder.DECREASING) {
            this._labelArrow.beginFill(0xFFFFFF, 0.8);
            this._labelArrow.moveTo(this._label.container.width + 4, 8);
            this._labelArrow.lineTo(this._label.container.width + 14, 8);
            this._labelArrow.lineTo(this._label.container.width + 9, 18);
            this._labelArrow.lineTo(this._label.container.width + 4, 8);
            this._labelArrow.endFill();
        } else if (this._sortOrder == SortOrder.INCREASING) {
            this._labelArrow.beginFill(0xFFFFFF, 0.8);
            this._labelArrow.moveTo(this._label.container.width + 4, 18);
            this._labelArrow.lineTo(this._label.container.width + 14, 18);
            this._labelArrow.lineTo(this._label.container.width + 9, 8);
            this._labelArrow.lineTo(this._label.container.width + 4, 18);
            this._labelArrow.endFill();
        }
    }

    public is_qualified(sol: Solution): boolean {
        if (this._data_type == DesignBrowserDataType.STRING) {
            let query_string: string = this._input_field.text;
            if (query_string.length == 0) {
                return true;
            }

            let target_low: string = sol.getProperty(this._columnName).toLowerCase();

            return (target_low.search(query_string.toLowerCase()) >= 0);
        } else {
            let query_min: string = this._input_field.text;
            if (query_min.length > 0) {
                if (sol.getProperty(this._columnName) < Number(query_min)) {
                    return false;
                }
            }

            let query_max: string = this._input_field2.text;
            if (query_max.length > 0) {
                if (sol.getProperty(this._columnName) > Number(query_max)) {
                    return false;
                }
            }

            return true;
        }
    }

    public set_reorganize_callback(reorganize: ReorganizeFunction): void {
        this._reorganize = reorganize;
    }

    public set_update_sort_callback(update_sort: SortFunction): void {
        this._update_sort = update_sort;
    }

    public get_exp(): string {
        return this._columnName;
    }

    public set_width(w: number): void {
        this._data_width = w;
        this._input_field.width = this._data_width;
    }

    // Draws grid text if it hasn't been drawn already
    public draw_grid_text(): void {
        if (this._grid_numbers != null) {
            return;
        }

        this._grid_numbers = new Container();
        this.container.addChild(this._grid_numbers);

        for (let ii = 0; ii < this._data_width / 280; ii++) {
            let gridstring = `${ii * 20 + 20}`;
            let gridtext = Fonts.arial(gridstring, 10).bold().build();
            gridtext.position = new Point(300 + ii * 280 - gridstring.length * 3.5, 80);
            this._grid_numbers.addChild(gridtext);
        }
    }

    public get_width(): number {
        return this._data_width;
    }

    public set_show_exp(show_exp_data: boolean): void {
        this._show_exp_data = show_exp_data;
        this.display_data();
    }

    public set_exp_data(exp_data: Feedback[]): void {
        this._exp_data = exp_data;
    }

    //Set Raw Data for each Column
    public set_data_and_display(raw: any[]): void {
        this._raw_col_data = [];

        for (let ii = 0; ii < raw.length; ii++) {
            if (this._data_type == DesignBrowserDataType.INT) {
                this._raw_col_data.push(int(raw[ii]));
            } else if (this._data_type == DesignBrowserDataType.STRING) {
                this._raw_col_data.push(raw[ii]);
            } else if (this._data_type == DesignBrowserDataType.NUMBER) {
                this._raw_col_data.push(Number(raw[ii]));
            } else {
                throw new Error("Unrecognized data type " + this._data_type);
            }
        }
        //Initial Display
        this.display_data();
    }

    public set_progress(offset: number): void {
        this._offset = offset;
        this.display_data();
    }

    public set_column_color(col: number): void {
        this._col = col;

        this._graphics.clear();
        this._graphics.beginFill(col);
        this._graphics.drawRect(0, 0, this._data_width, this._height);
        this._graphics.endFill();

        if (this._columnName == "Sequence") {
            this._graphics.lineStyle(1, 0x92A8BB, 0.4);
            for (let ii = 0; ii < this._data_width / 70 + 1; ii++) {
                this._graphics.moveTo(ii * 70 + 90, 85);
                this._graphics.lineTo(ii * 70 + 90, this._height - 5);
            }
        }
    }

    private toggle_sort_state(): void {
        if (this._sortOrder == SortOrder.INCREASING) {
            this._sortOrder = SortOrder.DECREASING;
        } else if (this._sortOrder == SortOrder.DECREASING) {
            this._sortOrder = SortOrder.NONE;
        } else {
            this._sortOrder = SortOrder.INCREASING;
        }

        if (this._update_sort != null) {
            this._update_sort(this._columnName, this._sortOrder, null);
        }
    }

    private handle_key_down(e: KeyboardEvent): void {
        if (this._reorganize != null) {
            this._reorganize(false);
        }
        e.stopPropagation();
    }

    private display_data(): void {
        let dataString = "";
        let boardData: string[] = [];
        let board_exp_data: any[] = [];

        let pairs_length: number = 0;
        if (this._pairs_array != null) {
            for (let pair of this._pairs_array) {
                if (pair >= 0) {
                    pairs_length++;
                }
            }
            pairs_length /= 2;
        }

        for (let ii = this._offset; ii < this._offset + this._num_display; ii++) {
            if (ii >= this._raw_col_data.length) {
                dataString += "\n";
            } else {
                let rawstr = Utility.stripHtmlTags("" + this._raw_col_data[ii]);

                //trace(rawstr);
                switch (this._columnName) {
                case DesignBrowserColumnName.Sequence:
                    boardData.push(rawstr);
                    board_exp_data.push(this._exp_data[ii]);

                    break;

                case DesignBrowserColumnName.Votes:
                    if (this._raw_col_data[ii] >= 0) {
                        dataString += rawstr + "\n";
                    } else {
                        dataString += "-\n";
                    }
                    break;

                case DesignBrowserColumnName.My_Votes:
                    if (this._raw_col_data[ii] >= 0) {
                        dataString += rawstr + "\n";
                    } else {
                        dataString += "-\n";
                    }

                    break;

                case DesignBrowserColumnName.Synthesis_score:
                    let exp: Feedback = null;
                    if (this._exp_data != null) {
                        exp = this._exp_data[ii];
                    }

                    if (exp == null) {
                        dataString += "-\n";
                    } else {

                        let brent_data: any = exp.brentTheoData;
                        if (brent_data != null) {
                            dataString += Utility.roundTo(brent_data['score'], 3) + "x";
                            dataString += " (" + Utility.roundTo(brent_data['ribo_without_theo'], 3) + " / " + Utility.roundTo(brent_data['ribo_with_theo'], 3) + ")\n";
                        } else {
                            if (this._raw_col_data[ii] >= 0) {
                                dataString += rawstr + " / 100\n";
                            } else if (this._raw_col_data[ii] < 0) {
                                dataString += Feedback.EXPDISPLAYS[Feedback.EXPCODES.indexOf(this._raw_col_data[ii])] + "\n";
                            } else {
                                dataString += "-\n";
                            }
                        }
                    }
                    break;

                case DesignBrowserColumnName.Title:
                    dataString += rawstr + "\n";
                    break;

                case DesignBrowserColumnName.Melting_Point:
                    dataString += rawstr + " 'C\n";
                    break;

                case DesignBrowserColumnName.Free_Energy:
                    dataString += rawstr + " kcal\n";
                    break;

                case DesignBrowserColumnName.GU_Pairs:
                    if (pairs_length > 0) {
                        dataString += rawstr + ` (${Math.round(this._raw_col_data[ii] / pairs_length * 100)}%)\n`;
                    } else {
                        dataString += rawstr + "\n";
                    }
                    break;

                case DesignBrowserColumnName.GC_Pairs:
                    if (pairs_length > 0) {
                        dataString += rawstr + ` (${Math.round(this._raw_col_data[ii] / pairs_length * 100)}%)\n`;
                    } else {
                        dataString += rawstr + "\n";
                    }
                    break;

                case DesignBrowserColumnName.UA_Pairs:
                    if (pairs_length > 0) {
                        dataString += rawstr + ` (${Math.round(this._raw_col_data[ii] / pairs_length * 100)}%)\n`;
                    } else {
                        dataString += rawstr + "\n";
                    }
                    break;

                default:
                    dataString += rawstr + "\n";
                    break;
                }
            }
        }

        this._dataDisplay.text = dataString;

        if (boardData.length > 0) {
            if (this._show_exp_data) {
                this._sequence_board.set_sequences(boardData, board_exp_data, this._pairs_array);
            } else {
                this._sequence_board.set_sequences(boardData, null, this._pairs_array);
            }

            this._sequence_board.display.position = new Point(11 + this._dataDisplay.width + 5, DataCol.DATA_H);
        } else {
            this._sequence_board.set_sequences(null, null, null);
        }
    }

    private readonly _fontType: string;
    private readonly _fontSize: number;
    private readonly _sortable: boolean;
    private readonly _columnName: string;
    private readonly _data_type: DesignBrowserDataType;

    private _graphics: Graphics;

    private _width: number = 0;
    private _height: number = 0;

    private _dataDisplay: Text;

    private _raw_col_data: any[] = [];
    private _data_width: number;
    private _line_height: number;
    private _label: GameButton;
    private _labelArrow: Graphics;
    private _input_field: TextInputObject;
    private _input_field2: TextInputObject;
    private _field_string: Text;
    private _field_string2: Text;
    private _grid_numbers: Container;
    private _offset: number = 0;

    private _num_display: number;
    private _reorganize: ReorganizeFunction;
    private _update_sort: SortFunction;
    private _sortOrder: SortOrder = 0;
    private _exp_data: Feedback[];
    private _show_exp_data: boolean = false;
    private _pairs_array: number[];
    private _col: number = 0;

    private _sequence_board: SequenceBoard;

    private static readonly DATA_H = 88;
}
