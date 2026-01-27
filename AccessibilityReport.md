# Accessibility Report - Date & Time Range Picker

## Compliance Summary
The component follows WAI-ARIA Authoring Practices for Date Pickers (Grid pattern).

## Keyboard Navigation Support
| Key | Action |
| --- | --- |
| `Tab` | Enter/Exit the picker, navigate between inputs and buttons |
| `Left Arrow` | Move to previous day |
| `Right Arrow` | Move to next day |
| `Up Arrow` | Move to same day in previous week |
| `Down Arrow` | Move to same day in next week |
| `Enter / Space` | Select the focused day |
| `Esc` | Close the picker popover |

## ARIA Implementation
- **Roles**: `grid`, `row`, `columnheader`, `gridcell`, `dialog`.
- **States**: `aria-selected` for current range, `aria-expanded` for trigger button, `aria-haspopup`.
- **Labels**: Descriptive `aria-label` for buttons and days.

## Contrast & Visuals
- High-contrast brand colors (`#3366ff` on white).
- Focus rings for all interactive elements.
- Semantic feedback for invalid states (red alerts with descriptive text).
