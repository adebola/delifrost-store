import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TreeviewConfig, TreeviewHelper, TreeviewItem} from 'ngx-treeview';

@Component({
    selector: 'app-treeview-wrapper',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
})
export class TreeViewWrapperComponent implements OnInit {
    @Input() items: TreeviewItem[];
    @Output() itemSelected = new EventEmitter<any>();

    public item: string;

    config: TreeviewConfig;

    ngOnInit(): void {
        this.config = TreeviewConfig.create({
            hasAllCheckBox: false,
            hasCollapseExpand: false,
            hasFilter: false,
            maxHeight: 500
        });
    }

    select(item: TreeviewItem): void {

        if (!item.children) {

            if (item.value === 'All') {
                this.item = null;
            } else {
                this.item = item.value;
            }

            this.itemSelected.emit(item.value);
        }
    }
}
