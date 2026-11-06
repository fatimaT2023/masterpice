Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase
function Pump-Media([int]$Milliseconds) {
 $frame = New-Object System.Windows.Threading.DispatcherFrame
 $timer = New-Object System.Windows.Threading.DispatcherTimer
 $timer.Interval = [TimeSpan]::FromMilliseconds($Milliseconds)
 $timer.Add_Tick({ $this.Stop(); $frame.Continue = $false }.GetNewClosure())
 $timer.Start()
 [System.Windows.Threading.Dispatcher]::PushFrame($frame)
}
$player = New-Object System.Windows.Media.MediaPlayer
try {
 $player.Volume = 0
 $player.Open([Uri]'C:\Users\user\Downloads\WhatsApp Video 2026-11-06 at 3.30.17 PM.mp4')
 Pump-Media 2500
 if (-not $player.HasVideo) { throw 'The local video decoder did not open this reference.' }
 $player.Play()
 Pump-Media 700
 $player.Pause()
 Write-Output ('Video size: ' + $player.NaturalVideoWidth + 'x' + $player.NaturalVideoHeight)
 foreach ($second in @(1,4)) {
  $player.Position = [TimeSpan]::FromSeconds($second)
  Pump-Media 800
  $visual = New-Object System.Windows.Media.DrawingVisual
  $drawing = $visual.RenderOpen()
  $drawing.DrawVideo($player, (New-Object System.Windows.Rect(0,0,$player.NaturalVideoWidth,$player.NaturalVideoHeight)))
  $drawing.Close()
  $bitmap = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($player.NaturalVideoWidth,$player.NaturalVideoHeight,96,96,[System.Windows.Media.PixelFormats]::Pbgra32)
  $bitmap.Render($visual)
  $encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
  $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
  $target = Join-Path $PWD ('.video-review/navbar-reference-' + $second + '.png')
  $stream = [IO.File]::OpenWrite($target)
  try { $encoder.Save($stream) } finally { $stream.Dispose() }
  Write-Output $target
 }
} finally { $player.Close() }
