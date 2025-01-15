import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface GoalNode {
  name: string;
  children?: GoalNode[];
  x?: number;
  y?: number;
  parent?: GoalNode;
  expanded?: boolean;
  visible?: boolean;
}

@Component({
  selector: 'app-quality-model',
  templateUrl: './quality-model.component.html',
  styleUrl: './quality-model.component.css'
})
export class QualityModelComponent implements OnInit {
  @Input() metadata: any;
  @Output() goalsSelected = new EventEmitter<string[]>();

  qualityModel: any;
  selectedGoals: string[] = [];

  nodes: any[] = [];
  topLevelNodes: GoalNode[] = [];
  svgWidth = 1500;
  svgHeight = 600;
  rectWidth = 200;
  rectHeight = 60;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getQualityModel().subscribe((data) => {
      this.qualityModel = data;
      const treeData = this.transformToTreeNodes(data.goals);
      this.generateCoordinates(treeData, 200, 150);
      this.nodes = treeData;
      this.topLevelNodes = this.nodes.filter((n) => !n.parent);
      this.adjustSvgSize();
    });
  }

  toggleGoalSelection(node: GoalNode): void {
    const index = this.selectedGoals.indexOf(node.name);
    if (index > -1) {
      this.selectedGoals.splice(index, 1);
    } else {
      this.selectedGoals.push(node.name);
    }

    this.goalsSelected.emit(this.selectedGoals);
  }

  toggleExpand(node: GoalNode): void {
    node.expanded = !node.expanded;

    if (node.expanded) {
      const longestSubGoalName = node.children
        ? Math.max(...node.children.map((child) => child.name.length))
        : 0;
      this.adjustMenuWidth(longestSubGoalName);
    }
  }

  private adjustMenuWidth(longestNameLength: number): void {
    const baseWidth = 150;
    const extraWidthPerChar = 7; // Adjust this factor based on font size
    const calculatedWidth = baseWidth + longestNameLength * extraWidthPerChar;

    document.querySelectorAll('.contextual-menu').forEach((menu) => {
      (menu as HTMLElement).style.width = `${Math.min(calculatedWidth, 300)}px`;
    });
  }

  private transformToTreeNodes(goals: any[], parent?: GoalNode): GoalNode[] {
    return goals.map((goal) => {
      const node: GoalNode = {
        name: goal.name,
        parent,
        expanded: false,
        visible: true,
        children: goal.subGoals ? this.transformToTreeNodes(goal.subGoals) : undefined,
      };
      return node;
    });
  }

  private generateCoordinates(nodes: GoalNode[], x: number, y: number): void {
    nodes.forEach((node, index) => {
      node.x = x + index * (this.rectWidth + 50);
      node.y = y;

      if (node.children && node.expanded) {
        this.generateCoordinates(node.children, node.x + 300, y + 100);
      }
    });
  }

  private adjustSvgSize(): void {
    const allNodes = this.flattenNodes(this.nodes);
    const maxX = Math.max(...allNodes.map((node) => node.x ?? 0));
    const maxY = Math.max(...allNodes.map((node) => node.y ?? 0));

    this.svgWidth = Math.max(this.svgWidth, maxX + 200);
    this.svgHeight = Math.max(this.svgHeight, maxY + 100);
  }

  private flattenNodes(nodes: GoalNode[]): GoalNode[] {
    return nodes.reduce((acc: GoalNode[], node) => {
      acc.push(node);
      if (node.children) {
        acc.push(...this.flattenNodes(node.children));
      }
      return acc;
    }, []);
  }
}
