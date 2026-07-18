const CATEGORY_COLORS = [
  '#E87B4F',
  '#3FBE8C',
  '#C57AD6',
  '#4FC3C9',
  '#1E3A66',
  '#F08B5C',
  '#6B6E76',
]

export function getCategoryColor(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}
