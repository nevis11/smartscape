"""
Converts room layout JSON → a Blender Python script.
The script uses bpy to build the full 3D room when run inside Blender.
"""
from typing import Any


# Colour map for furniture by type (fallback)
_TYPE_COLORS = {
    "bed":       (0.835, 0.686, 0.416),
    "sofa":      (0.267, 0.447, 0.643),
    "desk":      (0.545, 0.435, 0.278),
    "chair":     (0.267, 0.267, 0.267),
    "wardrobe":  (0.608, 0.463, 0.325),
    "table":     (0.722, 0.525, 0.306),
    "lamp":      (1.000, 0.843, 0.000),
    "bookshelf": (0.545, 0.271, 0.075),
    "tv_unit":   (0.200, 0.200, 0.200),
    "plant":     (0.133, 0.545, 0.133),
}


def _hex_to_rgb(hex_color: str) -> tuple[float, float, float]:
    hex_color = hex_color.lstrip("#")
    if len(hex_color) != 6:
        return (0.8, 0.8, 0.8)
    r, g, b = (int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))
    return (r, g, b)


def generate_blender_script(layout: dict[str, Any]) -> str:
    room = layout.get("room", {})
    furniture = layout.get("furniture", [])

    rw = room.get("width", 5)
    rd = room.get("depth", 4)
    rh = room.get("height", 3)
    wall_color = _hex_to_rgb(room.get("wall_color", "#F5F5F0"))
    floor_color = _hex_to_rgb(room.get("floor_color", "#8B6F47"))
    style = room.get("style", "modern")

    lines = [
        "import bpy",
        "import math",
        "",
        "# ── AI SmartScape – Auto-generated room script ──",
        f"# Style: {style}",
        "",
        "# ── Clear scene ──────────────────────────────────",
        "bpy.ops.object.select_all(action='SELECT')",
        "bpy.ops.object.delete(use_global=False)",
        "for mat in bpy.data.materials:",
        "    bpy.data.materials.remove(mat)",
        "",
        "# ── Helper: create material ──────────────────────",
        "def make_mat(name, rgb, alpha=1.0):",
        "    mat = bpy.data.materials.new(name)",
        "    mat.use_nodes = True",
        "    bsdf = mat.node_tree.nodes.get('Principled BSDF')",
        "    bsdf.inputs['Base Color'].default_value = (*rgb, alpha)",
        "    bsdf.inputs['Roughness'].default_value = 0.6",
        "    return mat",
        "",
        "# ── Helper: add labelled box ─────────────────────",
        "def add_box(name, loc, dim, rgb, rot_z=0):",
        "    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)",
        "    obj = bpy.context.active_object",
        "    obj.name = name",
        "    obj.scale = (dim[0], dim[1], dim[2])",
        "    obj.rotation_euler.z = math.radians(rot_z)",
        "    mat = make_mat(name + '_mat', rgb)",
        "    obj.data.materials.append(mat)",
        "    return obj",
        "",
        "# ── Room geometry ─────────────────────────────────",
        f"W, D, H = {rw}, {rd}, {rh}",
        f"WALL  = {wall_color}",
        f"FLOOR = {floor_color}",
        "CEIL  = (0.95, 0.95, 0.95)",
        "",
        "# Floor",
        "add_box('Floor',   (0, 0, 0),       (W, D, 0.05), FLOOR)",
        "# Ceiling",
        "add_box('Ceiling', (0, 0, H),       (W, D, 0.05), CEIL)",
        "# Back wall",
        "add_box('Wall_Back',  (0, -D/2, H/2), (W, 0.1, H), WALL)",
        "# Front wall",
        "add_box('Wall_Front', (0,  D/2, H/2), (W, 0.1, H), WALL)",
        "# Left wall",
        "add_box('Wall_Left',  (-W/2, 0, H/2), (0.1, D, H), WALL)",
        "# Right wall",
        "add_box('Wall_Right', ( W/2, 0, H/2), (0.1, D, H), WALL)",
        "",
        "# ── Furniture ────────────────────────────────────",
    ]

    for i, item in enumerate(furniture):
        ftype  = item.get("type", "box")
        label  = item.get("label", ftype.capitalize())
        pos    = item.get("position", [0, 0, 0])
        size   = item.get("size", [1, 1, 1])
        color  = _hex_to_rgb(item.get("color", "#888888"))
        rot    = item.get("rotation", 0)

        # Lift object so it sits on the floor (z + half height)
        half_h = size[2] / 2 if len(size) > 2 else 0.5
        loc = (
            pos[0] if len(pos) > 0 else 0,
            pos[2] if len(pos) > 2 else 0,   # swap y/z: Blender Y = depth
            half_h,
        )

        safe_label = label.replace(" ", "_").replace("'", "")
        lines += [
            f"# {label}",
            f"add_box('{safe_label}_{i}', {loc}, {tuple(size)}, {color}, rot_z={rot})",
            "",
        ]

    # Lamp (world background light)
    lines += [
        "# ── Lighting ─────────────────────────────────────",
        "bpy.ops.object.light_add(type='SUN', location=(0, 0, H + 1))",
        "sun = bpy.context.active_object",
        "sun.data.energy = 3",
        "",
        "bpy.ops.object.light_add(type='AREA', location=(0, 0, H - 0.3))",
        "area = bpy.context.active_object",
        "area.data.energy = 500",
        "area.data.size   = max(W, D) * 0.6",
        "",
        "# ── Camera ───────────────────────────────────────",
        "bpy.ops.object.camera_add(location=(W*0.8, -D*0.9, H*0.85))",
        "cam = bpy.context.active_object",
        "cam.rotation_euler = (math.radians(55), 0, math.radians(40))",
        "bpy.context.scene.camera = cam",
        "",
        "# ── Render settings ──────────────────────────────",
        "bpy.context.scene.render.engine = 'CYCLES'",
        "bpy.context.scene.cycles.samples = 64",
        "bpy.context.scene.render.resolution_x = 1280",
        "bpy.context.scene.render.resolution_y = 720",
        "",
        "# Frame the camera on the room",
        "bpy.context.view_layer.objects.active = cam",
        "",
        "print('AI SmartScape: Room built successfully!')",
    ]

    return "\n".join(lines)
