# tools/generate_spritesheet.ps1
# Gera public/assets/dino_hatch_sheet.png (grid 4x2 de frames 128x128, pixel art 32x32 escalado x4)
# Skill: pixel-art-prompting -- grid exato, sem anti-aliasing, paleta limitada.
param(
  [string]$OutFile = (Join-Path $PSScriptRoot "..\public\assets\dino_hatch_sheet.png")
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

$cell = 32
$scale = 4
$cols = 4
$rows = 2
$fw = $cell * $scale   # 128
$fh = $cell * $scale   # 128

# Paleta oficial (skill pixel-art-prompting) -- Dictionary case-sensitive (G != g)
$palette = [System.Collections.Generic.Dictionary[string, string]]::new([System.StringComparer]::Ordinal)
$palette['K'] = '#1a1a24'  # contorno
$palette['W'] = '#f5f0e1'  # ovo claro
$palette['S'] = '#cfc7b0'  # ovo sombra
$palette['C'] = '#8a8264'  # rachadura
$palette['G'] = '#4ecb71'  # dino corpo
$palette['g'] = '#2e8b57'  # dino sombra
$palette['H'] = '#ffffff'  # brilho
$colors = @{}
foreach ($k in $palette.Keys) { $colors[$k] = [System.Drawing.ColorTranslator]::FromHtml($palette[$k]) }
$transparent = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)

function New-Grid {
  $g = New-Object 'char[,]' $script:cell, $script:cell
  for ($x = 0; $x -lt $script:cell; $x++) { for ($y = 0; $y -lt $script:cell; $y++) { $g[$x, $y] = [char]'.' } }
  return ,$g
}

function Set-Px($g, [int]$x, [int]$y, [string]$c) {
  if ($x -ge 0 -and $x -lt $script:cell -and $y -ge 0 -and $y -lt $script:cell) { $g[$x, $y] = $c }
}

function Fill-Ellipse($g, [int]$cx, [int]$cy, [int]$rx, [int]$ry, [string]$c, [string[]]$onlyFrom = $null) {
  if ($rx -le 0 -or $ry -le 0) { return }
  for ($y = $cy - $ry; $y -le $cy + $ry; $y++) {
    for ($x = $cx - $rx; $x -le $cx + $rx; $x++) {
      $nx = ($x - $cx) / $rx; $ny = ($y - $cy) / $ry
      if (($nx * $nx + $ny * $ny) -le 1.0) {
        if ($onlyFrom) {
          if ($onlyFrom -contains $g[$x, $y]) { Set-Px $g $x $y $c }
        } else { Set-Px $g $x $y $c }
      }
    }
  }
}

function Draw-Line($g, [int]$x0, [int]$y0, [int]$x1, [int]$y1, [string]$c, [string[]]$onlyFrom = $null) {
  $steps = [Math]::Max([Math]::Abs($x1 - $x0), [Math]::Abs($y1 - $y0))
  if ($steps -eq 0) { $steps = 1 }
  for ($i = 0; $i -le $steps; $i++) {
    $x = [int][Math]::Round($x0 + ($x1 - $x0) * $i / $steps)
    $y = [int][Math]::Round($y0 + ($y1 - $y0) * $i / $steps)
    if ($onlyFrom) { if ($onlyFrom -contains $g[$x, $y]) { Set-Px $g $x $y $c } }
    else { Set-Px $g $x $y $c }
  }
}

# Largura meia do ovo na linha y (-1 se fora)
function Get-EggHw([int]$y) {
  if ($y -lt 10 -or $y -gt 31) { return -1 }
  return [int][Math]::Round(5 + 4 * [Math]::Pow(($y - 10) / 21.0, 1.4))
}

function Draw-EggBody($g, [int]$sx) {
  # contorno (casco cheio)
  for ($y = 10; $y -le 31; $y++) {
    $hw = Get-EggHw $y
    for ($x = 16 - $hw + $sx; $x -le 16 + $hw + $sx; $x++) { Set-Px $g $x $y 'K' }
  }
  # interior claro
  for ($y = 11; $y -le 30; $y++) {
    $hw = (Get-EggHw $y) - 1
    for ($x = 16 - $hw + $sx; $x -le 16 + $hw + $sx; $x++) { Set-Px $g $x $y 'W' }
  }
  # sombra inferior direita
  Fill-Ellipse $g (18 + $sx) 25 6 5 'S' @('W')
}

function Draw-OpenShell($g, [int]$topY) {
  # casco inferior aberto com borda serrilhada; interior escuro
  for ($y = $topY; $y -le 31; $y++) {
    $hw = Get-EggHw $y
    if ($hw -lt 1) { continue }
    for ($x = 16 - $hw; $x -le 16 + $hw; $x++) {
      $dx = [Math]::Abs($x - 16)
      if ($dx -eq $hw) { Set-Px $g $x $y 'K'; continue }
      $jag = if ((($x + 40) % 5) -lt 2) { 1 } else { 0 }
      $colTop = $topY + $jag
      if ($y -eq $colTop) { Set-Px $g $x $y 'C' }
      elseif ($y -eq ($colTop + 1)) { Set-Px $g $x $y 'K' }
      elseif ($y -eq 31) { Set-Px $g $x $y 'K' }
      else { Set-Px $g $x $y 'W' }
    }
  }
  Fill-Ellipse $g 19 ([Math]::Min($topY + 6, 28)) 4 3 'S' @('W')
}

function Draw-Head($g, [int]$cx, [int]$cy, [int]$r, [bool]$lookLeft) {
  Fill-Ellipse $g $cx $cy ($r + 1) ($r + 1) 'K'
  Fill-Ellipse $g $cx $cy $r $r 'G'
  Fill-Ellipse $g ($cx + 2) ($cy + 2) ($r - 2) ($r - 2) 'g' @('G')
  $ex = if ($lookLeft) { $cx - 2 } else { $cx + 2 }
  Set-Px $g $ex ($cy - 1) 'K'
  Set-Px $g ($ex + 1) ($cy - 1) 'K'
  Set-Px $g $ex $cy 'K'
  Set-Px $g ($ex + 1) $cy 'K'
  Set-Px $g ($ex + $(if ($lookLeft) { 1 } else { 0 })) ($cy - 1) 'H'
}

function Draw-Body($g, [int]$cx, [int]$cy, [int]$rx, [int]$ry) {
  Fill-Ellipse $g $cx $cy ($rx + 1) ($ry + 1) 'K'
  Fill-Ellipse $g $cx $cy $rx $ry 'G'
  Fill-Ellipse $g ($cx + 1) ($cy + 1) ($rx - 1) ($ry - 2) 'g' @('G')
}

# ---------- construção dos 8 frames ----------
$frames = @()

# Frame 0: ovo intacto
$g = New-Grid; Draw-EggBody $g 0; $frames += ,$g

# Frame 1: tremor (deslocado + marcas de movimento)
$g = New-Grid; Draw-EggBody $g 1
Draw-Line $g 6 13 6 17 'C'; Draw-Line $g 27 13 27 17 'C'
$frames += ,$g

# Frame 2: primeira rachadura
$g = New-Grid; Draw-EggBody $g 0
Draw-Line $g 16 10 15 13 'C' @('K','W','S')
Draw-Line $g 15 13 17 16 'C' @('K','W','S')
Draw-Line $g 17 16 16 19 'C' @('K','W','S')
$frames += ,$g

# Frame 3: rachadura ramificada
$g = New-Grid; Draw-EggBody $g 0
Draw-Line $g 16 10 15 14 'C' @('K','W','S')
Draw-Line $g 15 14 17 18 'C' @('K','W','S')
Draw-Line $g 17 18 16 22 'C' @('K','W','S')
Draw-Line $g 15 14 11 17 'C' @('K','W','S')
Draw-Line $g 17 18 21 21 'C' @('K','W','S')
$frames += ,$g

# Frame 4: topo do ovo aberto
$g = New-Grid; Draw-OpenShell $g 16; $frames += ,$g

# Frame 5: cabeca emergindo
$g = New-Grid
Draw-Head $g 16 11 5 $false
Draw-OpenShell $g 17
$frames += ,$g

# Frame 6: dino quase todo de fora
$g = New-Grid
Draw-Body $g 16 17 6 4
Draw-Head $g 16 9 5 $false
Draw-OpenShell $g 21
$frames += ,$g

# Frame 7: dino completo olhando para o lado
$g = New-Grid
Draw-Line $g 11 21 7 18 'G' @('G','g','.','K')
Fill-Ellipse $g 10 21 3 3 'K'; Fill-Ellipse $g 10 21 2 2 'G'
Draw-Body $g 16 21 6 5
Set-Px $g 13 27 'K'; Set-Px $g 14 27 'K'; Set-Px $g 13 28 'G'; Set-Px $g 14 28 'G'; Set-Px $g 13 29 'G'; Set-Px $g 14 29 'G'; Set-Px $g 13 30 'K'; Set-Px $g 14 30 'K'
Set-Px $g 18 27 'K'; Set-Px $g 19 27 'K'; Set-Px $g 18 28 'G'; Set-Px $g 19 28 'G'; Set-Px $g 18 29 'G'; Set-Px $g 19 29 'G'; Set-Px $g 18 30 'K'; Set-Px $g 19 30 'K'
Draw-Head $g 16 10 5 $true
# fragmentos do casco
Fill-Ellipse $g 7 29 4 3 'K'; Fill-Ellipse $g 7 29 3 2 'W'; Set-Px $g 7 27 'C'
Fill-Ellipse $g 25 29 3 2 'K'; Fill-Ellipse $g 25 29 2 1 'W'; Set-Px $g 25 28 'C'
$frames += ,$g

# ---------- blit para bitmap ----------
$bmpW = $fw * $cols
$bmpH = $fh * $rows
$bmp = [System.Drawing.Bitmap]::new($bmpW, $bmpH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g0 = [System.Drawing.Graphics]::FromImage($bmp)
$g0.Clear($transparent)
$g0.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g0.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$g0.Dispose()

for ($f = 0; $f -lt 8; $f++) {
  $col = $f % $cols
  $row = [Math]::Floor($f / $cols)
  $ox = $col * $fw
  $oy = $row * $fh
  $grid = $frames[$f]
  for ($x = 0; $x -lt $cell; $x++) {
    for ($y = 0; $y -lt $cell; $y++) {
      $ch = $grid[$x, $y]
      $color = if ($ch -eq '.') { $transparent } else { $colors[[string]$ch] }
      for ($sx = 0; $sx -lt $scale; $sx++) {
        for ($sy = 0; $sy -lt $scale; $sy++) {
          $bmp.SetPixel($ox + $x * $scale + $sx, $oy + $y * $scale + $sy, $color)
        }
      }
    }
  }
}

$outDir = Split-Path -Parent $OutFile
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
$bmp.Save($OutFile, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "Spritesheet gerado: $OutFile ($bmpW x $bmpH, 4x2 frames de 128px)"
