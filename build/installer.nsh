; Anjam — server stamping for the Windows installer.
; The download server names the installer  Anjam-Setup-1.3.0.srv-<host>.exe ; we read our own
; file name and store https://<host> so the app connects without asking the user.
!include "StrFunc.nsh"
${Using:StrFunc} StrStr
!macro customInstall
  Push $R0
  Push $R1
  StrCpy $R0 "$EXEFILE"
  ${StrStr} $R1 $R0 ".srv-"
  ${If} $R1 != ""
    StrCpy $R1 $R1 "" 5          ; drop ".srv-"
    ${StrStr} $R0 $R1 ".exe"
    ${If} $R0 != ""
      StrLen $R0 $R0
      IntOp $R0 0 - $R0
      StrCpy $R1 $R1 $R0        ; drop trailing ".exe"
    ${EndIf}
    CreateDirectory "$APPDATA\anjam"
    FileOpen $R0 "$APPDATA\anjam\server.json" w
    FileWrite $R0 '{"server":"https://$R1"}'
    FileClose $R0
  ${EndIf}
  Pop $R1
  Pop $R0
!macroend
