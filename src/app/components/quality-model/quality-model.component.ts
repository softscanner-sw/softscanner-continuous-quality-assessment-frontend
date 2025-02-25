import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { GoalNode } from '../../shared/models/types.model';
import { MatDialog } from '@angular/material/dialog';
import { GoalDetailsComponent } from '../../shared/components/goal-details/goal-details.component';

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

  qualityModel: any; // Holds the quality model data retrieved from the API
  selectedGoals: string[] = []; // List of currently selected goal names
  selectedGoal: GoalNode | null = null; // Currently selected goal for details view

  nodes: any[] = []; // Array containing all nodes in the quality model tree
  topLevelNodes: GoalNode[] = []; // Top-level nodes in the quality model tree (nodes without a parent)
  svgWidth = 1500; // Initial width of the SVG canvas used for rendering the tree
  svgHeight = 600; // Initial height of the SVG canvas
  rectWidth = 200; // Width of each rectangular node in the tree
  rectHeight = 60; // Height of each rectangular node in the tree

  constructor(private apiService: ApiService, private dialog: MatDialog) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches the quality model from the API and prepares the tree structure for display.
   */
  ngOnInit(): void {
    this.apiService.getQualityModel().subscribe((data) => {
      this.qualityModel = data;

      // Transform the quality model data into a tree structure
      const treeData = this.transformToTreeNodes(data.goals);

      // Generate (x, y) coordinates for the nodes in the tree
      this.generateCoordinates(treeData, 200, 150);

      // Store the nodes and identify the top-level nodes
      this.nodes = treeData;
      this.topLevelNodes = this.nodes.filter((n) => !n.parent);

      // Adjust the SVG canvas size to fit the nodes
      this.adjustSvgSize();
    });
  }

  /**
   * Toggles the selection state of a goal.
   * If the goal is already selected, it removes it from the selection; otherwise, it adds it.
   * @param node The goal node to be toggled
   */
  toggleGoalSelection(node: GoalNode): void {
    const index = this.selectedGoals.indexOf(node.name);
    if (index > -1) {
      this.selectedGoals.splice(index, 1); // Remove the goal from the selection
    } else {
      this.selectedGoals.push(node.name); // Add the goal to the selection
    }

    // Emit the updated list of selected goals to the parent component
    this.goalsSelected.emit(this.selectedGoals);
  }

  /**
   * Toggles the expanded state of a goal node.
   * If the node has children, it shows or hides them and adjusts the menu width.
   * @param node The goal node to be expanded or collapsed
   */
  toggleExpand(node: GoalNode): void {
    node.expanded = !node.expanded;

    if (node.expanded) {
      const longestSubGoalName = node.children
        ? Math.max(...node.children.map((child) => child.name.length))
        : 0;
      this.adjustMenuWidth(longestSubGoalName);
    }
  }

  /**
   * Adjusts the width of the contextual menu based on the length of the longest child name.
   * @param longestNameLength Length of the longest child name
   */
  private adjustMenuWidth(longestNameLength: number): void {
    const baseWidth = 150;
    const extraWidthPerChar = 7; // Adjust width by this factor for each character
    const calculatedWidth = baseWidth + longestNameLength * extraWidthPerChar;

    document.querySelectorAll('.contextual-menu').forEach((menu) => {
      (menu as HTMLElement).style.width = `${Math.min(calculatedWidth, 300)}px`; // Max width capped at 300px
    });
  }

  /**
   * Displays the details of the selected goal in a separate view.
   * @param node The goal node whose details are to be displayed
   */
  showGoalDetails(node: GoalNode): void {
    this.selectedGoal = {
      name: node.name,
      description: node.description,
      parent: node.parent
    };
    this.dialog.open(GoalDetailsComponent, {
      data: node,
      width: '600px'
    });
  }

  /**
   * Closes the goal details view.
   */
  closeGoalDetails(): void {
    this.selectedGoal = null;
  }

  /**
   * Recursively transforms the goals into a tree structure of nodes.
   * @param goals Array of goal objects to be transformed
   * @param parent Optional parent node for the current set of goals
   * @returns Array of transformed goal nodes
   */
  private transformToTreeNodes(goals: any[], parent?: GoalNode): GoalNode[] {
    return goals.map((goal) => {
      const node: GoalNode = {
        name: goal.name,
        description: goal.description,
        parent,
        expanded: false,
        visible: true,
        children: goal.subGoals ? this.transformToTreeNodes(goal.subGoals, goal) : undefined,
      };
      return node;
    });
  }

  /**
   * Generates (x, y) coordinates for each node in the tree structure.
   * @param nodes Array of nodes to be positioned
   * @param x Initial x-coordinate for the nodes
   * @param y Initial y-coordinate for the nodes
   */
  private generateCoordinates(nodes: GoalNode[], x: number, y: number): void {
    nodes.forEach((node, index) => {
      node.x = x + index * (this.rectWidth + 50); // Calculate x-coordinate with spacing between nodes
      node.y = y; // Set y-coordinate

      if (node.children && node.expanded) {
        this.generateCoordinates(node.children, node.x + 300, y + 100); // Recurse for child nodes
      }
    });
  }

  /**
   * Adjusts the size of the SVG canvas to fit all nodes in the tree structure.
   */
  private adjustSvgSize(): void {
    const allNodes = this.flattenNodes(this.nodes);
    const maxX = Math.max(...allNodes.map((node) => node.x ?? 0));
    const maxY = Math.max(...allNodes.map((node) => node.y ?? 0));

    this.svgWidth = Math.max(this.svgWidth, maxX + 200); // Add padding to the maximum x-coordinate
    this.svgHeight = Math.max(this.svgHeight, maxY + 100); // Add padding to the maximum y-coordinate
  }

  /**
   * Flattens the hierarchical node structure into a single array of nodes.
   * @param nodes Array of hierarchical nodes to be flattened
   * @returns Flat array of nodes
   */
  private flattenNodes(nodes: GoalNode[]): GoalNode[] {
    return nodes.reduce((acc: GoalNode[], node) => {
      acc.push(node);
      if (node.children) {
        acc.push(...this.flattenNodes(node.children)); // Recurse for child nodes
      }
      return acc;
    }, []);
  }

  /**
 * Computes the contextual menu width based on the longest child name.
 */
  getContextualMenuWidth(node: GoalNode): number {
    if (!node.children || node.children.length === 0) {
      return 300; // default width
    }
    const maxNameLength = Math.max(...node.children.map(child => child.name.length));
    const calculatedWidth = 150 + maxNameLength * 7;
    return Math.min(calculatedWidth, 300);
  }

  /**
   * Computes the contextual menu height based on the number of child nodes.
   * Assumes each child item has a height of about 48px plus padding.
   */
  getContextualMenuHeight(node: GoalNode): number {
    if (!node.children) {
      return 400; // default height
    }
    const height = node.children.length * 48 + 20;
    return Math.min(height, 400);
  }
}
