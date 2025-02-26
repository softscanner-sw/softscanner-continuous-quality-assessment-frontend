import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ApiService } from '../../services/api.service';
import { GoalDetailsComponent } from '../../shared/components/goal-details/goal-details.component';
import { GoalNode } from '../../shared/models/types.model';

/**
 * Component to visualize and interact with the quality model of an application.
 * It displays the quality model as a tree structure and allows users to select goals.
 */
@Component({
  selector: 'app-quality-model',
  templateUrl: './quality-model.component.html',
  styleUrl: './quality-model.component.css'
})
export class QualityModelComponent implements OnInit {
  @Input() metadata: any; // Application metadata used for quality assessment
  @Output() goalsSelected = new EventEmitter<string[]>(); // Event emitter to send selected goals to the parent component

  /**
   * Names of currently selected goals
   */
  selectedGoals: string[] = [];

  // Angular Material tree control and data source
  treeControl = new NestedTreeControl<GoalNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<GoalNode>();

  constructor(private apiService: ApiService, private dialog: MatDialog) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches the quality model from the API and prepares the tree structure for display.
   */
  ngOnInit(): void {
    this.apiService.getQualityModel().subscribe((data) => {
      // Transform the API quality model data into a tree structure of GoalNode objects.
      this.dataSource.data = this.transformToTreeNodes(data.goals);
    });
  }

  // Determines if a node has children
  hasChild = (_: number, node: GoalNode) => !!node.children && node.children.length > 0;

  /**
   * Toggles the selection state of a goal.
   * If the goal is already selected, it removes it from the selection; otherwise, it adds it.
   * @param node The goal node to be toggled
   */
  toggleGoalSelection(node: GoalNode): void {
    node.selected = !node.selected;
    if (this.hasChild(0, node)) {
      this.propagateSelection(node, node.selected);
    }

    this.selectedGoals = this.collectSelectedNodes(this.dataSource.data);
    // Emit the list of selected goal names
    this.goalsSelected.emit(this.selectedGoals);
  }

  // Recursively update the selection state for all children of a node.
  propagateSelection(node: GoalNode, selected: boolean): void {
    if (node.children) {
      node.children.forEach(child => {
        child.selected = selected;
        this.propagateSelection(child, selected);
      });
    }
  }

  // Recursively collect the names of selected nodes.
  collectSelectedNodes(nodes: GoalNode[]): string[] {
    let selected: string[] = [];
    nodes.forEach(node => {
      if (node.selected) {
        selected.push(node.name);
      }
      if (node.children && node.children.length > 0) {
        selected = selected.concat(this.collectSelectedNodes(node.children));
      }
    });
    return selected;
  }

  /**
   * Displays the details of the selected goal in a separate view.
   * @param node The goal node whose details are to be displayed
   */
  showGoalDetails(node: GoalNode): void {
    this.dialog.open(GoalDetailsComponent, {
      data: node,
      width: '600px'
    });
  }

  /**
   * Recursively transforms the goals into a tree structure of nodes.
   * @param goals Array of goal objects to be transformed
   * @param parent Optional parent node for the current set of goals
   * @returns Array of transformed goal nodes
   */
  private transformToTreeNodes(goals: any[], parent?: GoalNode, level: number = 0): GoalNode[] {
    return goals.map((goal) => {
      const node: GoalNode = {
        name: goal.name,
        description: goal.description,
        parent,
        level,
        expanded: false,
        visible: true,
        selected: false,
        children: goal.subGoals ? this.transformToTreeNodes(goal.subGoals, goal, level + 1) : [],
      };
      return node;
    });
  }

  /**
   * Returns a background color based on the node's level.
   * Uses shades from the indigo palette.
   */
  getNodeBackgroundColor(node: GoalNode): string {
    switch (node.level) {
      case 0: return '#e8eaf6'; // Indigo 50
      case 1: return '#f3e5f5'; // Lavender blush (soft purple)
      case 2: return '#e8f5e9'; // Honeydew (soft green)
      default: return '#fce4ec'; // Misty rose (soft pink)
    }
  }
}
