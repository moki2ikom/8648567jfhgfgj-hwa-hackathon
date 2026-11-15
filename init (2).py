#!/usr/bin/env python3
"""Happy While Away hackathon: sets up everything on this computer for you.

Put it in a new, empty folder (that folder becomes your project), open a terminal in that folder, and run:
  Mac or Linux:  python3 init.py
  Windows:       py init.py

Everything happens in the folder init.py is in. It installs what's missing (Node, Git, OpenCode, GitHub's and Vercel's tools) in
your own user folder (never as admin), signs you in to GitHub and Vercel in your browser, makes your GitHub repo and Vercel project,
helps you add two free model keys to OpenCode, checks you in, and starts OpenCode in this folder. It's safe to run again in the same
folder: what's already done is kept and skipped. init.py never asks you to type or paste a key: GitHub's, Vercel's and OpenCode's
own tools keep your logins.
"""
import hashlib
import json
import os
import platform
import re
import shutil
import ssl
import stat
import subprocess
import sys
import tarfile
import tempfile
import time
import urllib.error
import urllib.request
import zipfile
from urllib.parse import urlsplit

CONFIG = {
    "server": "https://apply-happywhileaway.vercel.app",
    "token": "HWA-SF4Z-B0B4-NR0M-9NKT",
    "name": "moki ikom",
    "first": "moki",
    "roll": "8648567jfhgfgj",
    "project": "8648567jfhgfgj-hwa-hackathon",
    "mark": "62ae3dc32bd4",
    "opencode": "1.19.5"
}  # yours: made for moki by the hackathon page

VERSION = "1.4.0"
# Python from python.org on a Mac often has no certificates: then the system's own bundle is used (macOS keeps one at
# /etc/ssl/cert.pem; Linux at /etc/ssl/certs).
_CTX = None


# Where init.py downloads from, over https only: the hackathon site, and the tools' own publishers (Node from nodejs.org, GitHub's
# tool and Git for Windows from GitHub's releases). A redirect anywhere else, or to plain http, is refused. Plain http is allowed
# only to this computer itself (the tests' stand-in site).
TRUSTED = ("nodejs.org", "github.com", "objects.githubusercontent.com", "release-assets.githubusercontent.com")
LOCAL = ("127.0.0.1", "localhost", "::1")


def trusted(url):
    try:
        u = urlsplit(url)
        host = (u.hostname or "").lower()
    except ValueError:
        return False
    if host in LOCAL:
        return u.scheme in ("http", "https")
    return u.scheme == "https" and (host in TRUSTED or host == (urlsplit(SERVER).hostname or "").lower())


class _Checked(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not trusted(newurl):
            raise urllib.error.URLError(f"a redirect to {urlsplit(newurl).hostname or 'another address'} was refused")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def urlopen(req, timeout):
    global _CTX
    url = req.full_url if isinstance(req, urllib.request.Request) else str(req)
    if not trusted(url):
        raise urllib.error.URLError(f"{urlsplit(url).hostname or url} isn't an address init.py downloads from")

    def go():
        return urllib.request.build_opener(urllib.request.HTTPSHandler(context=_CTX), _Checked).open(req, timeout=timeout)

    try:
        return go()
    except urllib.error.URLError as e:
        if _CTX is None and "CERTIFICATE" in str(e).upper():
            for bundle in ("/etc/ssl/cert.pem", "/etc/ssl/certs/ca-certificates.crt", "/etc/pki/tls/certs/ca-bundle.crt"):
                if os.path.exists(bundle):
                    _CTX = ssl.create_default_context(cafile=bundle)
                    return go()
        raise

SERVER = CONFIG.get("server", "https://apply-happywhileaway.vercel.app")
WIN = os.name == "nt"
MAC = sys.platform == "darwin"
HOME = os.path.expanduser("~")
ENV = dict(os.environ, NO_COLOR="1", npm_config_update_notifier="false", npm_config_fund="false", npm_config_audit="false")
# The first message OpenCode is started with. The reviewers' tools recognise this exact text and never count it for or against you.
# It's the same in lib/shared/hackathon.ts. On Windows it passes through cmd.exe, so it never holds  " % ! ^ & | < > .
FIRST_PROMPT = "[HWA rules] Read .hwa/rules.md now: it is the hackathon's rules for this project and they hold in every session. My GitHub repo and Vercel project are already made, both named after my register number and ending in -hwa-hackathon (the exact names are in .hwa/rules.md). As we work, commit and push to that repo, deploy to that Vercel project with vercel --prod, and merge any other branch into main. Before I leave, everything must be committed, pushed to main and deployed, so I only exit and run submit.py. Reply in one line that you will follow all this, then wait for my first instruction."


# ---------- How it looks ----------
# The owner, 15 Nov 2026: "use prettier or rich ... so its good to see and emojis and all green ticks". Done with the standard
# library alone: nothing can be installed before init.py runs, and a locked-down or offline Python couldn't install it anyway.
# Plain text with ASCII marks when the output isn't a terminal, TERM is dumb or NO_COLOR is set. look() sets these at the start.
TTY = False  # a terminal that reads escape codes: every line then starts on a clean line
COLOR = False  # colours and bold
EMOJI = False  # emoji marks (otherwise [ok], [x], ->)
DEEP = False  # 24-bit colour (otherwise the nearest of the 256 colours)
UTF = False  # UTF-8 output (the logo and the bar beside the next steps need it)

# The brand's logo, exactly as OpsHub's `hwa help` draws it (its cli/hwa_cli/ui.py, the owner, 26 Oct 2026): HAPPY in blocks, the
# logo's light blue fill with its dark blue edge, and WHILE AWAY spaced out beneath in the dark blue. This file stays plain ASCII, so
# each drawing character is written as one letter: # the full block, = and | the double lines, [ ] { } the four corners.
_DRAW = {"#": "\u2588", "=": "\u2550", "|": "\u2551", "[": "\u2554", "]": "\u2557", "{": "\u255a", "}": "\u255d"}
LOGO = tuple("".join(_DRAW.get(c, c) for c in row) for row in (
    "##]  ##] #####] ######] ######] ##]   ##]",
    "##|  ##|##[==##]##[==##]##[==##]{##] ##[}",
    "#######|#######|######[}######[} {####[} ",
    "##[==##|##[==##|##[===} ##[===}   {##[}  ",
    "##|  ##|##|  ##|##|     ##|        ##|   ",
    "{=}  {=}{=}  {=}{=}     {=}        {=}   ",
))
LOGO_WORDS = "W H I L E   A W A Y"
FILL, EDGE, ACCENT, INK = "#bcd3ea", "#406a94", "#3cc6d0", "#0b1f33"  # the logo's light and dark blue, OpsHub's accent, dark text

# Each mark: its emoji, its plain stand-in, and the plain one's colour.
MARKS = {
    "ok": ("\u2705", "[ok]", 32),
    "bad": ("\u274c", "[x]", 31),
    "do": ("\U0001f449", "->", 36),
    "warn": ("\u2757", "[!]", 33),
    "wait": ("\u23f3", "..", 36),
    "key": ("\U0001f511", "*", 33),
    "web": ("\U0001f310", "->", 36),
    "go": ("\U0001f680", "->", 36),
    "skip": ("\u2796", "[-]", 33),
    "party": ("\U0001f389", "*", 32),
    "tip": ("\U0001f4a1", "*", 33),
}


def looks(tty, env, encoding, win):
    """What a terminal can show, as (escape codes, colour, emoji, 24-bit colour, UTF-8), from whether the output is a terminal, the
    environment and the output's encoding."""
    term = env.get("TERM", "")
    utf = "utf" in (encoding or "").lower()
    ansi = bool(tty) and term != "dumb"
    color = ansi and not env.get("NO_COLOR")
    # Emoji need a UTF-8 terminal that draws them: not Linux's text console, and on Windows only Windows Terminal or VS Code (the
    # older console window shows boxes).
    emoji = color and utf and term != "linux" and (not win or bool(env.get("WT_SESSION")) or env.get("TERM_PROGRAM") == "vscode")
    deep = color and (env.get("COLORTERM", "").lower() in ("truecolor", "24bit") or bool(env.get("WT_SESSION")))
    return ansi, color, emoji, deep, utf


def vt_on():
    """Windows 10 and later draw colours in PowerShell and cmd once the console is told to read escape codes (virtual terminal
    processing). Anywhere else they just work."""
    if not WIN:
        return True
    try:
        import ctypes

        kernel = ctypes.windll.kernel32
        handle = kernel.GetStdHandle(-11)  # this program's output
        mode = ctypes.c_uint32()
        if not kernel.GetConsoleMode(handle, ctypes.byref(mode)):
            return False
        return bool(mode.value & 4) or bool(kernel.SetConsoleMode(handle, mode.value | 4))
    except Exception:
        return False


def look():
    """The terminal set up once, before anything is said: UTF-8 where it can be, escape codes on in Windows' console, and the flags."""
    global TTY, COLOR, EMOJI, DEEP, UTF
    try:
        tty = sys.stdout.isatty()
    except (AttributeError, ValueError, OSError):
        tty = False
    for stream in (sys.stdout, sys.stderr):
        try:
            # A letter the output can't show is replaced, never a failure.
            stream.reconfigure(**({"encoding": "utf-8", "errors": "replace"} if tty or WIN else {"errors": "replace"}))
        except Exception:
            pass
    TTY, COLOR, EMOJI, DEEP, UTF = looks(tty and vt_on(), os.environ, getattr(sys.stdout, "encoding", ""), WIN)


def code(*parts):
    return ("\x1b[" + ";".join(str(p) for p in parts) + "m") if COLOR else ""


def paint(text, *parts):
    """Text in colour or bold (an escape code's parts: 1 bold, 2 dim, 31 red, 32 green, or rgb()), or as it is in plain text."""
    if not COLOR or not parts or not text:
        return text
    return code(*parts) + text + code(0)


def nearest256(r, g, b):
    """The closest of the 256 colours most terminals have: the 6 by 6 by 6 cube or the grey ramp, whichever is nearer."""
    steps = (0, 95, 135, 175, 215, 255)
    idx = [min(range(6), key=lambda i: abs(steps[i] - v)) for v in (r, g, b)]
    grey = min(23, max(0, ((r + g + b) // 3 - 3) // 10))
    level = 8 + grey * 10

    def far(c):
        return sum((x - y) ** 2 for x, y in zip(c, (r, g, b)))

    if far((level, level, level)) < far(tuple(steps[i] for i in idx)):
        return 232 + grey
    return 16 + 36 * idx[0] + 6 * idx[1] + idx[2]


def rgb(hexcolor, back=False):
    """A brand colour as an escape code's parts: exact in a 24-bit terminal, else the nearest of the 256 colours."""
    r, g, b = (int(hexcolor[i:i + 2], 16) for i in (1, 3, 5))
    layer = 48 if back else 38
    return f"{layer};2;{r};{g};{b}" if DEEP else f"{layer};5;{nearest256(r, g, b)}"


_MARKUP = re.compile(r"\*\*(.+?)\*\*|`([^`\n]+)`")


def md(text, *base):
    """Our light markup, drawn: **bold**, and `a command` in bold on the accent colour, the same everywhere so commands stand out on a
    light or dark terminal. In plain text the marks just go. base is the rest of the line's style."""
    out, at = [], 0
    for m in _MARKUP.finditer(text):
        out.append(paint(text[at:m.start()], *base))
        if m.group(1) is not None:
            out.append(paint(m.group(1), *(base + (1,))))
        else:
            out.append(paint(" " + m.group(2) + " ", 1, rgb(INK), rgb(ACCENT, back=True)) if COLOR else m.group(2))
        at = m.end()
    out.append(paint(text[at:], *base))
    return "".join(out)


def _out(s):
    try:
        sys.stdout.write(s)
    except UnicodeEncodeError:
        # A terminal that can't show some letter (a name, a folder): show the rest rather than fail.
        enc = getattr(sys.stdout, "encoding", None) or "ascii"
        sys.stdout.write(s.encode(enc, "replace").decode(enc))
    sys.stdout.flush()


_SGR = re.compile(r"\x1b\[[0-9;]*m")
_LEAD = re.compile(r"( *(?:[\u258c|] +)?(?:(?:\d+\.|\[[a-z!x-]+\]|->|\*|[^\x00-\x7f]{1,2}) +)?)")


def cells(ch):
    """How many columns a letter takes in a terminal: two for emoji and other wide letters."""
    import unicodedata

    return 2 if ord(ch) >= 0x1100 and unicodedata.east_asian_width(ch) in ("W", "F") else 1


def fit(text):
    """A line too long for this terminal, broken at spaces into rows that fit, each later row starting under the first row's words,
    after its mark or number (and its bar, beside the next steps). A terminal would otherwise break it in the middle of a word. Never
    inside a piece on a coloured background (a command, a header), so a command stays whole; bold text carries on bold."""
    width = shutil.get_terminal_size((80, 24)).columns - 1
    vis = _SGR.sub("", text)
    if not TTY or width < 30 or sum(cells(c) for c in vis) <= width:
        return [text]
    lead = _LEAD.match(vis).group(1)
    hang_w = sum(cells(c) for c in lead)
    if hang_w > width // 2:
        return [text]
    pre = len(vis) - len(vis.lstrip(" "))
    bar = vis[pre:pre + 1] if vis[pre:pre + 1] in ("\u258c", "|") else ""
    hang = " " * pre + (paint(bar, rgb(ACCENT)) if bar == "\u258c" else bar) + " " * (hang_w - pre - len(bar))
    rows, rest, first, style = [], text, True, ""
    while True:
        col, now, cut, over, i = 0 if first else hang_w, style, None, False, 0
        while i < len(rest):
            m = _SGR.match(rest, i)
            if m:
                now = "" if m.group(0) == "\x1b[0m" else m.group(0)
                i = m.end()
                continue
            if rest[i] == " " and ";48;" not in now and col >= (hang_w if first else hang_w + 1):
                cut, at_cut = i, now
            col += cells(rest[i])
            if col > width:
                over = True
                break
            i += 1
        lead_in = "" if first else hang + style
        if not over or cut is None:
            rows.append(lead_in + rest)
            return rows
        # A style still on at the break (bold) is closed at the row's end and opened again after the next row's indent.
        rows.append(lead_in + rest[:cut].rstrip(" ") + ("\x1b[0m" if at_cut else ""))
        rest, first, style = rest[cut:].lstrip(" "), False, at_cut


def line(text=""):
    """One finished line. In a terminal it starts by clearing its row, so it never runs into text already there (a tool's spinner,
    or what was on the screen before OpenCode)."""
    for row in fit(text):
        _out(("\r\x1b[K" if TTY else "") + row + "\n")


def say(text="", *base):
    for row in str(text).split("\n"):
        line(md(row, *base))


def mark(kind):
    emoji, plain, color = MARKS[kind]
    return emoji if EMOJI else paint(plain, 1, color)


def ok(text):
    say(f"  {mark('ok')} {text}")


def note(kind, text):
    say(f"  {mark(kind)} {text}")


STEPS = 8


def step(n, title):
    """Each step's coloured header, with a blank line above it: its number of the eight, and its name."""
    say("")
    if COLOR:
        dot = "\u00b7" if UTF else ":"
        line(paint(f" Step {n} of {STEPS} {dot} {title} ", 1, rgb("#ffffff"), rgb(EDGE, back=True)))
    else:
        say(f"[Step {n} of {STEPS}] {title}")


def numbered(items, indent=4):
    """Numbered steps; an item's later lines (after a line break) sit under its first."""
    pad = " " * indent
    for i, item in enumerate(items, 1):
        first, *rest = str(item).split("\n")
        say(f"{pad}{paint(str(i) + '.', 1)} {first}")
        for more in rest:
            say(f"{pad}   {more}")


def block(rows):
    """What matters most, set off: a blank line above and below, and a coloured bar down its left side."""
    bar = paint("\u258c", rgb(ACCENT)) if COLOR and UTF else "|"
    say("")
    for row in rows:
        line(f"  {bar} {md(row)}" if row else f"  {bar}")
    say("")


def logo(what, version):
    """The brand's logo at the very start, as OpsHub's hwa help draws it, then what this is. Plain text: just one line."""
    width = max(len(row) for row in LOGO)
    if not (COLOR and UTF) or shutil.get_terminal_size((80, 24)).columns < width + 4:
        say(f"Happy While Away hackathon {what} ({version})")
        return
    say("")
    for row in LOGO:
        drawn = "".join(paint(m.group(0), 1, rgb(FILL)) if m.group(0)[0] == "\u2588" else paint(m.group(0), rgb(EDGE)) for m in re.finditer("\u2588+|[^\u2588]+", row.ljust(width)))
        line("  " + drawn)
    pad = (width - len(LOGO_WORDS)) // 2
    line("  " + " " * pad + paint(LOGO_WORDS, 1, rgb(EDGE)))
    say("")
    line("  " + paint(f"Hackathon {what}", 1) + paint(f"   {version}", 2))


def settle():
    """After a tool that drew in this window (a spinner, a browser sign-in): colours off and the cursor shown again."""
    if TTY:
        _out("\x1b[0m\x1b[?25h")


def clear_for_full_screen():
    """Before OpenCode's own screen: the text so far scrolled up out of sight (it stays in the window's history), so wherever OpenCode
    leaves the cursor when it closes, there's no old text on the screen for the lines after it to run into."""
    if TTY:
        _out("\n" * max(shutil.get_terminal_size((80, 24)).lines, 1) + "\x1b[H")


def back_from_full_screen():
    """After OpenCode's own screen closes: the terminal set back (colours, cursor, mouse and paste modes) and a clean line with nothing
    below it. At its start OpenCode moves the cursor to the top corner to test the terminal, then asks the terminal to put it back;
    when the terminal doesn't, OpenCode closes near the top of the window, over text still there, and the lines printed after it ran
    into that old text (the owner's run, 15 Nov 2026: "OpenCode has closed. Next, send your entry:hen run it.")."""
    if TTY:
        _out("\x1b[0m\x1b[?25h\x1b[?1000l\x1b[?1002l\x1b[?1003l\x1b[?1006l\x1b[?2004l\r\n\x1b[J")


# ---------- Talking to the person ----------
RUN_AGAIN = "py init.py" if WIN else "python3 init.py"
# Every network problem ends with the same two checks.
ONLINE = ["Check this computer is online: open https://github.com in a browser.", "On a campus or office network, try a phone hotspot: some networks block these downloads."]


def interactive():
    try:
        return sys.stdin.isatty()
    except (AttributeError, ValueError, OSError):
        return False


def asked(question):
    """A question as it's shown: the question in bold, its hint in brackets dimmed, after a pointing hand."""
    lead = question[: len(question) - len(question.lstrip(" "))]
    body = question.strip()
    cut = body.rfind(" (")
    main, hint = (body[:cut], body[cut:]) if cut > 0 else (body, "")
    return f"{lead}{mark('do')} {md(main, 1)}{paint(hint, 2)} "


def ask(question, default=""):
    """A question and the answer typed (Enter gives the default). With no terminal to type in (answers from a file or another
    program), nothing typed ends the line, so it's ended here and the next line never runs into the question."""
    if question.startswith("\n"):
        say("")
        question = question.lstrip("\n")
    *rows, last = fit(asked(question))
    for row in rows:
        line(row)
    _out(("\r\x1b[K" if TTY else "") + last)
    try:
        answer = input()
        if not interactive():
            _out("\n")
    except EOFError:
        answer = ""
        _out("\n")
    return answer.strip() or default


YES = ("y", "yes", "yeah", "yep", "ok", "okay", "sure")
NO = ("n", "no", "nope", "nah")


def yes_no(question, default):
    """A yes-or-no question that can't trap anyone: Enter gives the default, yes or y, no or n, and anything else is explained
    and asked again (a few times, then the default)."""
    for _ in range(3):
        a = re.sub(r"[^a-z]", "", ask(question).lower())
        if not a:
            return default
        if a in YES:
            return True
        if a in NO:
            return False
        say("  Please type yes or no (or press Enter).")
    say(f"  Taken as {'yes' if default else 'no'}.")
    return default


def stop(problem, steps=(), again=True, then=()):
    """Every problem ends here: what's wrong, how to fix it in short numbered steps (then any lines to type), and init.py stops.
    Never a silent stop."""
    todo = list(steps) + ([f"Run init.py again: `{RUN_AGAIN}` (everything already done is kept)."] if again else [])
    wrong = paint("What's wrong:", 1, 31)
    say("")
    first, *rest = str(problem).split("\n")
    line(f"  {mark('bad')} {wrong} {md(first, 1)}")
    for more in rest:
        # A tool's own words (a git or Vercel error), as it wrote them, each on its own clean line.
        line("     " + more)
    if todo:
        say("")
        say("  **How to fix it:**")
        numbered(todo)
    for row in then:
        say(row)
    say("")
    say("  Stuck? Email hello@happywhileaway.com with a photo of this window.", 2)
    sys.exit(1)


# ---------- Running things ----------
def run(cmd, cwd=None, env=None, capture=True, timeout=600):
    """Run a command (a list), never through a shell. A bare name is looked up on our own PATH (ENV), not this process's: on
    Windows a program is otherwise found only on the PATH Python started with, so a Git installed a minute ago isn't. Windows
    starts a .cmd tool through cmd.exe, which reads the arguments itself, so none may hold  " % ! ^ & | < > . Always answers: a
    program that's missing or too slow comes back as a failure with the reason, never as nothing."""
    env = env or ENV
    cmd = list(cmd)
    if not os.path.dirname(cmd[0]):
        found = shutil.which(cmd[0], path=env.get("PATH"))
        if found:
            cmd[0] = found
    try:
        return subprocess.run(cmd, cwd=cwd, env=env, capture_output=capture, text=True, timeout=timeout, encoding="utf-8", errors="replace", shell=False)
    except OSError as e:
        return subprocess.CompletedProcess(cmd, 127, "", f"{os.path.basename(cmd[0])} couldn't start ({e})")
    except subprocess.TimeoutExpired:
        return subprocess.CompletedProcess(cmd, 124, "", f"{os.path.basename(cmd[0])} didn't finish within {timeout // 60} minutes")
    finally:
        if not capture:
            settle()


def said(r, most=600):
    """What a failed command said, short enough to show."""
    return ((r.stderr or "") + "\n" + (r.stdout or "")).strip()[-most:] if r else ""


def out(cmd, cwd=None):
    r = run(cmd, cwd=cwd)
    return (r.stdout or "").strip() if r and r.returncode == 0 else None


def version_of(cmd):
    text = out(cmd) or ""
    m = re.search(r"(\d+)\.(\d+)\.(\d+)", text)
    return tuple(int(x) for x in m.groups()) if m else None


def dotted(v):
    return ".".join(map(str, v))


# ---------- Where things go ----------
def machine():
    m = platform.machine().lower()
    arm = m in ("arm64", "aarch64", "armv8l")
    # Python running under Rosetta on an Apple Silicon Mac reports x86_64: ask the Mac itself.
    if MAC and not arm and (out(["sysctl", "-n", "hw.optional.arm64"]) or "").strip() == "1":
        arm = True
    osname = "win" if WIN else "darwin" if MAC else "linux"
    return f"{osname}-{'arm64' if arm else 'x64'}"


KEY = machine()
TOOLS = os.path.join(os.environ.get("LOCALAPPDATA") or os.path.join(HOME, "AppData", "Local"), "hwa-hackathon", "tools") if WIN else os.path.join(HOME, ".hwa-hackathon", "tools")


ADDED = []  # the folders init.py put in front of PATH, for the hwa-start launcher


def add_path(folder):
    if folder and os.path.isdir(folder) and folder not in ENV["PATH"].split(os.pathsep):
        ENV["PATH"] = folder + os.pathsep + ENV["PATH"]
        ADDED.insert(0, folder)


def q(path):
    """A program's path as it's typed in this computer's terminal: quoted if it has a space (PowerShell runs a quoted path with &)."""
    if " " not in path:
        return path
    return f'& "{path}"' if WIN else f'"{path}"'


# ---------- Downloading ----------
def fetch(url, dest=None, tries=4, what=None, quiet=False):
    """Download with retries. If Python's own certificates are missing (common on Macs), the system's curl takes over. When it
    can't, it stops with what to do, or with quiet=True answers None."""
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": f"hwa-init/{VERSION}"})
            with urlopen(req, 120) as r:
                data = r.read()
            if dest:
                with open(dest, "wb") as f:
                    f.write(data)
                return dest
            return data
        except urllib.error.HTTPError as e:
            last = f"the site answered {e.code}"
            if 400 <= e.code < 500 and e.code != 429:
                break
        except (urllib.error.URLError, ssl.SSLError, OSError) as e:
            last = getattr(e, "reason", None) or e
            if "CERTIFICATE" in str(e).upper() and shutil.which("curl") and trusted(url):
                target = dest or os.path.join(tempfile.mkdtemp(), "download")
                r = run(["curl", "-fsSL", "--proto", "=https", "--proto-redir", "=https", "--retry", "3", "-o", target, url], timeout=900)
                if r.returncode == 0:
                    if dest:
                        return dest
                    with open(target, "rb") as f:
                        return f.read()
        time.sleep(2 * (i + 1))
    if quiet:
        return None
    stop(f"Couldn't download {what or url} ({last}).", ONLINE)


def api(op, **fields):
    body = json.dumps({"op": op, "token": CONFIG.get("token"), **fields}).encode()
    req = urllib.request.Request(f"{SERVER}/api/hackathon/cli", data=body, headers={"Content-Type": "application/json", "User-Agent": f"hwa-init/{VERSION}"})
    try:
        with urlopen(req, 120) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        try:
            return {"error": json.loads(e.read() or b"{}").get("error", f"the site answered {e.code}"), "status": e.code}
        except Exception:
            return {"error": f"the site answered {e.code}", "status": e.code}
    except Exception as e:
        return {"error": f"couldn't reach the hackathon site ({getattr(e, 'reason', None) or e})", "status": 0}


def site_problem(what, error):
    """The hackathon site said no, or couldn't be reached: which, and what to do."""
    if "token" in error.lower():
        # The token in this file was replaced (a new token, or the entry started again), so only a new init.py works: one fix.
        stop("**This init.py's token no longer works.** Your token was changed on the hackathon page (a new token, or your entry was started again), so the site doesn't accept this copy.",
             [f"**Download your init.py again:** open {SERVER}/hackathon, sign in, and press **Download my init.py**.", "Save it in this folder, over this one, as init.py (if your browser names it init (1).py, rename it init.py).", f"Run the new one: `{RUN_AGAIN}`"], again=False)
    if "reach" in error.lower():
        stop(f"{what}: {error}.", ONLINE)
    stop(f"{what}: {error}", ["Wait a minute (the site may be busy)."])


def checked(archive, sha, what, by_hand):
    """A download runs only if it is byte for byte the file its publisher lists: the sha256 the hackathon site passes on from
    nodejs.org or GitHub. With no checksum to compare, it isn't used at all."""
    if not sha:
        stop(f"There's no published checksum for the {what} download just now, so init.py won't run it unchecked.", ["Wait a few minutes (the hackathon site may still be looking it up)."] + ONLINE + [by_hand])
    with open(archive, "rb") as f:
        if hashlib.sha256(f.read()).hexdigest() != str(sha).lower():
            stop(f"The {what} download didn't match its published checksum, so it wasn't used.", ONLINE + [by_hand])


def inside(base, path):
    """Whether a path in an archive stays inside the folder it is unpacked into."""
    p = os.path.realpath(os.path.join(base, path))
    return p == base or p.startswith(base + os.sep)


def unpack(archive, into):
    os.makedirs(into, exist_ok=True)
    if archive.endswith(".zip"):
        with zipfile.ZipFile(archive) as z:
            z.extractall(into)
    else:
        with tarfile.open(archive) as t:
            # Newer Pythons check every path in the archive stays inside the folder. Older ones are checked here first:
            # nothing outside the folder, no device, and no link that leads out of it.
            if hasattr(tarfile, "data_filter"):
                t.extractall(into, filter="data")
            else:
                base = os.path.realpath(into)
                for m in t.getmembers():
                    target = os.path.join(os.path.dirname(m.name), m.linkname) if m.issym() else m.linkname
                    if os.path.isabs(m.name) or not inside(base, m.name) or m.isdev() or ((m.issym() or m.islnk()) and (os.path.isabs(m.linkname) or not inside(base, target))):
                        raise tarfile.TarError(f"{m.name} would land outside the folder")
                t.extractall(into)
    # Executables keep their permission bits only from tar; make sure the bin folders can run.
    if not WIN:
        for root, _dirs, files in os.walk(into):
            if os.path.basename(root) == "bin":
                for name in files:
                    p = os.path.join(root, name)
                    try:
                        os.chmod(p, os.stat(p).st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
                    except OSError:
                        pass


def tool_links():
    """Where Node, gh and MinGit download from. Only needed for what's missing, so a failure here stops nothing yet."""
    data = fetch(f"{SERVER}/api/hackathon/tools", tries=2, quiet=True)
    try:
        return json.loads(data) if data else {}
    except ValueError:
        return {}


def no_download(tool, by_hand):
    """A tool is missing and there's no download for it: either the site couldn't be reached, or there is none for this computer."""
    stop(f"{tool} is missing, and init.py couldn't find a download of it for this computer ({KEY}).", ONLINE + [by_hand])


# ---------- The steps ----------
def need_config():
    if not CONFIG.get("token"):
        stop("This init.py isn't yours: it has no token in it.", [f"Open {SERVER}/hackathon and sign in with your email.", "Press **Download my init.py**, and save it in your folder (replace this one)."])
    if sys.version_info < (3, 8):
        stop(f"init.py needs Python 3.8 or later; this one is {platform.python_version()}.", ["Install the latest Python from python.org" + (" (tick 'Add python.exe to PATH')." if WIN else ".")])
    if not trusted(SERVER + "/"):
        stop("This init.py's hackathon site address isn't a secure (https) one, so nothing was downloaded.", ["Open the hackathon page, sign in, and press **Download my init.py** again.", "Save it over this one (same folder), then run it."], again=False)


def ensure_node(links):
    have = version_of(["node", "--version"])
    # Node 22.13 or later: OpenCode's history can then be read even when its export fails (node:sqlite), as on one Mac we saw.
    if have and have >= (22, 13, 0):
        ok(f"Node {dotted(have)} is ready.")
        return shutil.which("node", path=ENV["PATH"])
    folder = os.path.join(TOOLS, "node")
    exe = os.path.join(folder, "node.exe") if WIN else os.path.join(folder, "bin", "node")
    if os.path.exists(exe):
        add_path(folder if WIN else os.path.join(folder, "bin"))
        ok(f"Node {out([exe, '--version'])} is ready (set up for the hackathon earlier).")
        return exe
    item = ((links.get("node") or {}).get("files") or {}).get(KEY)
    if not item:
        no_download("Node 22.13 or later", "Or install Node 22 (LTS) yourself from https://nodejs.org, then close and reopen this terminal.")
    note("wait", f"{'Node ' + dotted(have) + ' is too old' if have else 'Node is missing'}: setting up Node {links['node'].get('version', '22')} just for the hackathon (no admin needed)...")
    tmp = tempfile.mkdtemp()
    archive = fetch(item["url"], os.path.join(tmp, os.path.basename(item["url"])), what="Node")
    checked(archive, item.get("sha256"), "Node", "Or install Node 22 (LTS) yourself from https://nodejs.org, then close and reopen this terminal.")
    try:
        unpack(archive, tmp)
    except (OSError, zipfile.BadZipFile, tarfile.TarError) as e:
        stop(f"The Node download couldn't be unpacked ({e}).", ["Check there's at least 500 MB free on this computer."])
    inner = next((os.path.join(tmp, d) for d in os.listdir(tmp) if d.startswith("node-v") and os.path.isdir(os.path.join(tmp, d))), None)
    if not inner:
        stop("The Node download didn't hold Node.", ["Or install Node 22 (LTS) yourself from https://nodejs.org, then close and reopen this terminal."])
    shutil.rmtree(folder, ignore_errors=True)
    os.makedirs(os.path.dirname(folder), exist_ok=True)
    shutil.move(inner, folder)
    add_path(folder if WIN else os.path.join(folder, "bin"))
    if not version_of([exe, "--version"]):
        stop("Node was set up but doesn't start.", ["Install Node 22 (LTS) yourself from https://nodejs.org, then close and reopen this terminal."])
    ok(f"Node {out([exe, '--version'])} is ready.")
    return exe


def npm_cmd():
    return shutil.which("npm.cmd" if WIN else "npm", path=ENV["PATH"]) or shutil.which("npm", path=ENV["PATH"])


def ensure_git(links):
    have = version_of(["git", "--version"])
    if have:
        ok(f"Git {dotted(have)} is ready.")
        return
    if WIN:
        url = (links.get("mingit") or {}).get(KEY)
        if not url:
            no_download("Git", "Or install Git yourself from https://git-scm.com/download/win (the defaults are fine), then close this terminal and open a new one in the same folder.")
        note("wait", "Git is missing: setting up a portable Git just for the hackathon (no admin needed)...")
        tmp = tempfile.mkdtemp()
        archive = fetch(url, os.path.join(tmp, "mingit.zip"), what="Git")
        checked(archive, ((links.get("mingit") or {}).get("sha256") or {}).get(KEY), "Git", "Or install Git yourself from https://git-scm.com/download/win (the defaults are fine), then close this terminal and open a new one in the same folder.")
        folder = os.path.join(TOOLS, "git")
        shutil.rmtree(folder, ignore_errors=True)
        try:
            unpack(archive, folder)
        except (OSError, zipfile.BadZipFile, tarfile.TarError) as e:
            stop(f"The Git download couldn't be unpacked ({e}).", ["Check there's at least 500 MB free on this computer."])
        add_path(os.path.join(folder, "cmd"))
        have = version_of(["git", "--version"])
        if not have:
            stop("Git was set up but doesn't start.", ["Install Git yourself from https://git-scm.com/download/win (the defaults are fine).", "Close this terminal, and open a new one in the same folder."])
        ok(f"Git {dotted(have)} is ready.")
    elif MAC:
        run(["xcode-select", "--install"])
        stop("Git is missing. On a Mac it comes with Apple's command line tools.", ["A window has opened (if not, run `xcode-select --install`). Press **Install** and wait until it's done (a few minutes).", "Close this terminal, and open a new one in the same folder."])
    else:
        hint = "sudo apt install git" if shutil.which("apt") else "sudo dnf install git" if shutil.which("dnf") else "sudo pacman -S git" if shutil.which("pacman") else "sudo zypper install git" if shutil.which("zypper") else None
        stop("Git is missing.", [f"Install it: run `{hint}` (it asks for your password)." if hint else "Install Git with your system's package manager (see https://git-scm.com/download/linux)."])


def npm_tool(package, version, binary):
    """A command-line tool from npm, installed in our own folder (never system-wide, so no admin and no clash)."""
    prefix = os.path.join(TOOLS, "npm")
    bin_dir = prefix if WIN else os.path.join(prefix, "bin")
    exe = os.path.join(bin_dir, binary + (".cmd" if WIN else ""))
    want = version and tuple(int(x) for x in version.split(".")[:3])
    if os.path.exists(exe) and (not want or version_of([exe, "--version"]) == want):
        add_path(bin_dir)
        return exe
    npm = npm_cmd()
    if not npm:
        stop("npm, which comes with Node, wasn't found.", ["Install Node 22 (LTS) from https://nodejs.org: npm comes with it.", "Close this terminal, and open a new one in the same folder."])
    note("wait", f"Installing {package}{'@' + version if version else ''} just for the hackathon (a minute or two)...")
    r = run([npm, "install", "-g", "--prefix", prefix, f"{package}@{version or 'latest'}"], capture=False, timeout=1200)
    if r.returncode != 0 or not os.path.exists(exe):
        stop(f"Installing {package} didn't work (npm's reason is just above).", ONLINE + ["Check there's at least 1 GB free on this computer."])
    add_path(bin_dir)
    return exe


def ensure_opencode():
    want = CONFIG.get("opencode") or ""
    have = shutil.which("opencode", path=ENV["PATH"])
    if have and want and version_of([have, "--version"]) == tuple(int(x) for x in want.split(".")[:3]):
        ok(f"OpenCode {want} is ready.")
        return have
    exe = npm_tool("opencode-ai", want, "opencode")
    ok(f"OpenCode {out([exe, '--version']) or want} is ready.")
    return exe


def ensure_gh(links):
    have = shutil.which("gh", path=ENV["PATH"])
    if have and (version_of([have, "--version"]) or (0,)) >= (2, 40, 0):
        return have
    folder = os.path.join(TOOLS, "gh")
    for root, _d, files in os.walk(folder) if os.path.isdir(folder) else []:
        if ("gh.exe" if WIN else "gh") in files and os.path.basename(root) == "bin":
            add_path(root)
            return os.path.join(root, "gh.exe" if WIN else "gh")
    url = (links.get("gh") or {}).get(KEY)
    if not url:
        no_download("GitHub's command-line tool (gh)", "Or install it yourself from https://cli.github.com, then close this terminal and open a new one in the same folder.")
    note("wait", "Setting up GitHub's command-line tool (gh), just for the hackathon...")
    tmp = tempfile.mkdtemp()
    archive = fetch(url, os.path.join(tmp, os.path.basename(url)), what="GitHub's command-line tool")
    checked(archive, ((links.get("gh") or {}).get("sha256") or {}).get(KEY), "GitHub's command-line tool", "Or install it yourself from https://cli.github.com, then close this terminal and open a new one in the same folder.")
    shutil.rmtree(folder, ignore_errors=True)
    try:
        unpack(archive, folder)
    except (OSError, zipfile.BadZipFile, tarfile.TarError) as e:
        stop(f"GitHub's tool couldn't be unpacked ({e}).", ["Check there's at least 200 MB free on this computer."])
    for root, _d, files in os.walk(folder):
        if ("gh.exe" if WIN else "gh") in files and os.path.basename(root) == "bin":
            add_path(root)
            return os.path.join(root, "gh.exe" if WIN else "gh")
    stop("GitHub's tool didn't unpack.", ["Or install it yourself from https://cli.github.com, then close this terminal and open a new one in the same folder."])


def github_accounts(gh):
    r = run([gh, "auth", "status", "--hostname", "github.com"])
    text = ((r.stdout or "") + (r.stderr or "")) if r else ""
    return re.findall(r"account\s+([A-Za-z0-9-]+)", text) or re.findall(r"Logged in to github\.com as\s+([A-Za-z0-9-]+)", text)


def github_login(gh):
    accounts = github_accounts(gh)
    if len(accounts) > 1:
        say("  You're signed in to GitHub with more than one account:")
        for i, a in enumerate(accounts, 1):
            say(f"    {i}. {a}")
        pick = None
        for _ in range(3):
            a = ask("  Which one is yours for the hackathon? Type its number (Enter = 1, or 0 to sign in with another): ", "1").strip()
            if re.sub(r"[^a-z]", "", a.lower()) in YES:
                a = "1"
            named = [i for i, x in enumerate(accounts, 1) if x.lower() == a.lower().lstrip("@")]
            if named or (a.isdigit() and 0 <= int(a) <= len(accounts)):
                pick = named[0] if named else int(a)
                break
            say(f"  Type a number from 1 to {len(accounts)} (or 0 to sign in with another account).")
        if pick is None:
            pick = 1
            say(f"  Using {accounts[0]}.")
        if pick:
            r = run([gh, "auth", "switch", "--hostname", "github.com", "--user", accounts[pick - 1]])
            if r.returncode != 0:
                stop(f"GitHub couldn't switch to {accounts[pick - 1]}. {said(r, 300)}", [f"Switch by hand: run `{q(gh)} auth switch` and choose that account."])
        else:
            accounts = []
    elif accounts:
        if not yes_no(f"  Signed in to GitHub as {accounts[0]}. Use this account? (Enter = yes, or type no): ", True):
            accounts = []
    if not accounts:
        note("web", "**Signing in to GitHub in your browser:**")
        numbered(["Copy the one-time code it shows below, then press **Enter**: your browser opens GitHub.", "Sign in (no account yet? Create one there, it's free), paste the code, and press **Authorize**."])
        say("")
        r = run([gh, "auth", "login", "--hostname", "github.com", "--git-protocol", "https", "--web", "--skip-ssh-key"], capture=False, timeout=900)
        if r.returncode != 0:
            # An older gh has no --skip-ssh-key.
            r = run([gh, "auth", "login", "--hostname", "github.com", "--git-protocol", "https", "--web"], capture=False, timeout=900)
        if r.returncode != 0 or not github_accounts(gh):
            stop("You're not signed in to GitHub, so init.py can't make your repo.", ["No GitHub account yet? Make a free one at https://github.com/signup.", f"Sign in here: run `{q(gh)} auth login --web` and follow it (GitHub.com, HTTPS, Login with a web browser)."])
    # git push now uses this GitHub login (no SSH keys or tokens to manage).
    r = run([gh, "auth", "setup-git", "--hostname", "github.com"])
    if r.returncode != 0:
        stop(f"Git couldn't be set to push with your GitHub sign-in. {said(r, 300)}", [f"Run `{q(gh)} auth setup-git`"])
    r = run([gh, "api", "user"], timeout=120)
    try:
        user = json.loads(r.stdout) if r.returncode == 0 else {}
    except ValueError:
        user = {}
    login, uid = str(user.get("login") or ""), str(user.get("id") or "")
    if not re.match(r"^[A-Za-z0-9-]{1,39}$", login) or not uid.isdigit():
        stop(f"GitHub didn't say which account you're signed in with. {said(r, 300)}", ONLINE + [f"Check the sign-in: run `{q(gh)} auth status`"])
    return login, uid


# The repo and the Vercel project share one name, <register number>-hwa-hackathon (the owner, 14 Nov 2026); the project folder is
# the folder init.py is in, whatever its name (15 Nov 2026). Each repo or folder made here is marked as this entry's, so a later run
# reuses it and never takes over one that isn't (another project, or someone else's).
NAME = (CONFIG.get("project") or "entry-hwa-hackathon").lower()
MARK = CONFIG.get("mark") or hashlib.sha256(f"entry:{CONFIG.get('token')}".encode()).hexdigest()[:12]
REPO_NOTE = "Happy While Away hackathon entry"
REPO_TAG = f"hwa:{MARK}"
JUNK = {".DS_Store", "Thumbs.db", "desktop.ini", "init.py"}
# What a folder may already hold for a first run to make it the project: init.py itself (or a browser's second copy, like
# init (1).py), submit.py, what an earlier run started (.hwa, .git, .vercel), and the files computers add to any folder.
SETUP_FILES = {"submit.py", ".hwa", ".git", ".vercel", ".ds_store", "thumbs.db", "desktop.ini"}
INIT_COPY = re.compile(r"^init(?: ?\(\d+\)| copy(?: \d+)?| - copy(?: \(\d+\))?|[-_ ]\d+)?\.py$", re.I)


def read_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else {}
    except (OSError, ValueError):
        return {}


def folder_owner(folder):
    """Whose a folder is: "mine" (this entry's project), "other" (another entry's), "taken" (holds something else) or "free"."""
    cfg = os.path.join(folder, ".hwa", "config.json")
    if os.path.exists(cfg):
        old = read_json(cfg)
        if old.get("mark"):
            return "mine" if old["mark"] == MARK else "other"
        # Made by init.py before entries were marked: the same token, or the same person's details.
        same = old.get("token") == CONFIG.get("token") or (old.get("roll") and old.get("roll") == CONFIG.get("roll") and old.get("name") == CONFIG.get("name"))
        return "mine" if same else "other"
    if not os.path.isdir(folder):
        return "free"
    try:
        return "taken" if [n for n in os.listdir(folder) if n not in JUNK] else "free"
    except OSError:
        return "taken"


def me():
    """This file's own name (a browser may have saved it as init (1).py)."""
    return os.path.basename(os.path.abspath(__file__))


def others_in(folder):
    """What a folder holds besides init.py's own files, what an earlier run started, and what computers add to any folder."""
    try:
        names = os.listdir(folder)
    except OSError:
        return []
    return sorted(n for n in names if n.lower() not in SETUP_FILES and n.lower() != me().lower() and not INIT_COPY.match(n))


def shell_path(path):
    """A folder or file as it's typed in this computer's terminal: in quotes on Windows (PowerShell), and on a Mac or Linux as
    ~/... when it's in the home folder, quoted only when it must be."""
    if WIN:
        return f'"{path}"'
    import shlex

    rest = path[len(HOME):] if path.startswith(HOME + "/") else None
    if rest and re.match(r"^/[A-Za-z0-9._/-]+$", rest):
        return "~" + rest
    return path if re.match(r"^[A-Za-z0-9._/-]+$", path) else shlex.quote(path)


def earlier_project(here):
    """This entry's project from an earlier run of an older init.py, which made the project in a folder beside itself: there, or in
    the home folder. None when there isn't one."""
    for folder in [os.path.join(here, NAME)] + [os.path.join(here, f"{NAME}-{n}") for n in range(2, 10)] + [os.path.join(HOME, NAME)]:
        if os.path.realpath(folder) != os.path.realpath(here) and folder_owner(folder) == "mine":
            return folder
    return None


def new_folder():
    """A folder to suggest for the project: <register number>-hwa-hackathon in the home folder (not Desktop or Documents, which
    often sync), or with -2, -3 if that one already holds something."""
    for n in range(1, 10):
        folder = os.path.join(HOME, NAME if n == 1 else f"{NAME}-{n}")
        if not os.path.exists(folder) or (os.path.isdir(folder) and not os.path.exists(os.path.join(folder, ".hwa", "config.json")) and not others_in(folder)):
            return folder
    return os.path.join(HOME, f"{NAME}-new")


def move_here(here, there, make):
    """The steps to move init.py into a folder and run it there, then the same as lines to type in this terminal."""
    src = os.path.join(here, me())
    dest = os.path.join(there, "init.py")
    open_there = "Open a terminal in that folder: in Finder, right-click it, then **New Terminal at Folder**." if MAC else "Open a terminal in that folder: click its address bar in File Explorer, type powershell, press Enter." if WIN else "Open a terminal in that folder."
    steps = ([f"Make a new, empty folder for your project (not inside OneDrive or iCloud), for example {there}"] if make else []) + [f"Move init.py into {'it' if make else there}.", open_there, f"Run it again: `{RUN_AGAIN}`"]
    if WIN:
        typed = ([f"mkdir {shell_path(there)}"] if make and not os.path.isdir(there) else []) + [f"Move-Item -Force {shell_path(src)} {shell_path(dest)}", f"cd {shell_path(there)}", RUN_AGAIN]
    else:
        typed = ([f"mkdir -p {shell_path(there)}"] if make else []) + [f"mv {shell_path(src)} {shell_path(dest)}", f"cd {shell_path(there)}", RUN_AGAIN]
    then = ["", f"  Or type these {len(typed)} lines in this terminal{' (PowerShell)' if WIN else ''}, one at a time, pressing Enter after each:"] + [f"    `{t}`" for t in typed]
    return steps, then


def project_folder():
    """The project folder is the folder init.py is in (the owner, 15 Nov 2026: "make all the files and opencode to work in the same
    folder as init"); the repo and the Vercel project keep the name <register number>-hwa-hackathon. A run in a folder this entry
    already set up carries on. A first run takes only a folder holding nothing but init.py's own files, so nobody's Downloads or
    Desktop becomes their project: anything else is refused, kindly, with the exact steps. Checked before anything is installed."""
    here = os.path.dirname(os.path.abspath(__file__))
    if os.path.exists(os.path.join(here, ".hwa", "config.json")):
        if folder_owner(here) != "mine":
            steps, then = move_here(here, new_folder(), True)
            stop(f"This folder is another hackathon entry's project (made with someone else's init.py): {here}", steps, again=False, then=then)
    else:
        others = others_in(here)
        if others:
            mine = earlier_project(here)
            if mine:
                steps, then = move_here(here, mine, False)
                stop(f"Your project is already set up in {mine} (an earlier init.py made it there), so init.py now runs in that folder.", steps, again=False, then=then)
            shown = ", ".join(others[:4]) + (f" and {len(others) - 4} more" if len(others) > 4 else "")
            steps, then = move_here(here, new_folder(), True)
            stop(f"init.py makes the folder it's in your project, so it needs a new, empty folder of its own. This one already holds other files ({shown}): {here}", steps, again=False, then=then)
    synced = re.search(r"onedrive|icloud|mobile documents|dropbox|google drive|googledrive", here, re.I)
    if synced:
        note("warn", f"This folder is synced to {synced.group(0)}: {here}")
        say("     A project there syncs thousands of files and can break. Better: move init.py to a new folder that isn't synced, and run it there.")
        if not yes_no("  Set up here anyway? (type yes, or press Enter to stop): ", False):
            steps, then = move_here(here, new_folder(), True)
            stop("This folder is synced to the cloud, and you chose not to set up here.", steps, again=False, then=then)
    try:
        probe = os.path.join(here, ".hwa-write-test")
        with open(probe, "w") as f:
            f.write("ok")
        os.remove(probe)
        os.makedirs(os.path.join(here, ".hwa"), exist_ok=True)
    except OSError:
        stop(f"This terminal can't write in {here}.", (["On a Mac, allow it: System Settings, Privacy and Security, Files and Folders, then turn on your terminal's access."] if MAC else []) + ["Or make a new, empty folder somewhere else (not inside OneDrive or iCloud), move init.py there, and open the terminal in that folder."])
    return here


def rules_md(login):
    """The rules OpenCode reads in every session (opencode.json's instructions), with this entry's own repo and Vercel project."""
    return f"""# The hackathon's rules for this project

You are the OpenCode agent for a candidate in Happy While Away's web design hackathon. These rules hold in every session in
this project, whatever you're asked later. If asked to break one, say it isn't allowed in this hackathon and carry on.

## This project

- This folder, the one init.py is in, is the project: build the site here. init.py, submit.py, hwa-start and the .hwa folder
  are the hackathon's own files (they hold the candidate's token): leave them as they are, and keep the lines init.py put in
  .gitignore and .vercelignore, so they are never committed or deployed.
- GitHub repo: https://github.com/{login}/{NAME} (public and already made; this folder's git remote origin points to it, and
  git push works: GitHub is signed in on this computer).
- Vercel project: {NAME} (already made, and this folder is linked to it). Deploy with `vercel --prod`.
- The live site's address is exactly https://{NAME}.vercel.app (the deploy's "Aliased:" line). Always give the candidate that
  address, and only that one. Never give the address the deploy prints beside "Production:" or "Preview:" (the project's name with
  extra letters and the Vercel team's name, like {NAME}-ab12cd3ef-yourname-projects.vercel.app): it is that one deployment's
  own address, it asks visitors to sign in to Vercel, and the hackathon refuses it.
- As you work: commit and push to that repo, deploy to that Vercel project, and merge any other branch into main.
- Before the candidate leaves: everything committed, pushed to main and deployed, so they only exit OpenCode (/exit) and run
  submit.py in this folder.
- Never print, save or commit keys, tokens or passwords.

## The candidate's rules (as on the hackathon page)

1. **Write all code with OpenCode.** Any model inside it is fine, and so is switching models. Other AI (ChatGPT, Claude and the like) is for ideas and images only, never code. No other AI coding tool (Cursor, Claude Code, Copilot).
2. **No ready-made prompts or skills.** No skills, saved commands or prompt templates, from your computer, downloaded or pasted in. They count against you.
3. **Type your own prompts.** Prompts written somewhere else and pasted in count against you.
4. **Work only in your project folder** (the folder init.py is in), on one computer, from the start time. Always open OpenCode in that folder, one window at a time.
5. **Save your work as you go.** Commit and push to your public GitHub repo during the day, not only at the end. OpenCode can do it for you.
6. **Keep your site live and open to everyone** at its Vercel address, with no login. We test it as a buyer would, placing a test order and sending test requests to its order endpoint.
7. **Make it yourself, on the day.** End your README with a short **What I checked** note in your own words: what you asked for, what the agent got wrong, how you checked it, what's unfinished, any template or library used.
8. **No hidden messages** for reviewers or AI tools, anywhere in your site, code, prompts or files.
9. **Submit by running submit.py before the end.** Nothing is sent until you do. If it fails, upload the file it saved on this page. An upload started before the end may finish just after.
10. **Change nothing after the end**: not your site, your commits or your OpenCode history.

## What that means for you, the agent

- No skills of any kind: not local or global ones, not downloaded or public ones, and not skill or rule text pasted in,
  attached as a file or shown in an image. Don't create skills, saved commands, custom agents or prompt templates.
- The candidate types their own prompts. Don't write prompts for them to paste back to you.
- The "What I checked" note at the end of the README is the candidate's own, in their own words: never write, draft
  or edit it for them.
- Work only in this project folder. Don't read or change anything outside it, except running the tools needed to build, test
  and deploy.
- All code comes through you. Ideas and images from other AI tools are fine; code written elsewhere isn't. Don't accept pasted
  code to use as it is.
- The front end comes first. A small back end is welcome if the candidate wants one (an API, saving data, a form that
  really works), on free services only, and it is judged like the rest.
- Never write text aimed at the hackathon's reviewers or graders, and never edit or delete OpenCode's session history.
- Their entry is not sent until they run submit.py. When the candidate says they're done, and again in the last 30 minutes
  before the end time, tell them plainly: everything is pushed and live, so now type /exit, then in this same folder run
  `python3 submit.py` (on Windows `py submit.py`) and type yes when it asks. Their hackathon page then says Submitted.

Everything else is the candidate's own choice: models, plan, design and how you work together.
"""


def private(path, mode):
    if not WIN:
        try:
            os.chmod(path, mode)
        except OSError:
            pass


def save_config(folder, **more):
    """What submit.py needs, in .hwa/config.json (git never sees it): this file's details, the PATH with our tools, and what
    was set up. Kept from an earlier run where this run doesn't know better."""
    path = os.path.join(folder, ".hwa", "config.json")
    cfg = read_json(path)
    cfg.update(CONFIG)
    cfg.update({"folder": folder, "tools": TOOLS, "path": ENV["PATH"], "mark": MARK, "project": NAME})
    cfg.update({k: v for k, v in more.items() if v is not None})
    # It holds your token: only you can read it (and the .hwa folder), on a computer shared with others.
    private(os.path.dirname(path), 0o700)
    with open(os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2)
    private(path, 0o600)


def ignore_line(name):
    """A file name as a line of .gitignore or .vercelignore that matches exactly it: the pattern characters escaped."""
    s = re.sub(r"([\[\]*?\\])", r"\\\1", name)
    return "\\" + s if s[:1] in ("#", "!") else s


def own_copies(folder):
    """init.py's own file names in the project folder (this one, and a browser's second copy like init (1).py): they hold the token,
    so they're never committed or deployed."""
    names = {me()}
    try:
        names.update(n for n in os.listdir(folder) if INIT_COPY.match(n))
    except OSError:
        pass
    return [ignore_line(n) for n in sorted(names) if n != "init.py"]


def add_lines(path, wanted):
    """Lines added to a file such as .gitignore, keeping everything already in it."""
    lines = open(path, encoding="utf-8").read().splitlines() if os.path.exists(path) else []
    for row in wanted:
        if row not in lines:
            lines.append(row)
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def write_files(folder, login, uid):
    save_config(folder, github=login, github_id=uid)
    with open(os.path.join(folder, ".hwa", ".gitignore"), "w") as f:
        f.write("*\n")
    with open(os.path.join(folder, ".hwa", "rules.md"), "w", encoding="utf-8") as f:
        f.write(rules_md(login))
    # OpenCode reads the rules in every session (its "instructions" setting); anything already in opencode.json is kept.
    oc = os.path.join(folder, "opencode.json")
    data = {}
    if os.path.exists(oc):
        try:
            with open(oc, encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            data = {}
    data.setdefault("$schema", "https://opencode.ai/config.json")
    data["instructions"] = sorted(set((data.get("instructions") or []) + [".hwa/rules.md"]))
    with open(oc, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    # init.py and submit.py now live in the project folder itself, and init.py and .hwa/config.json hold the token: git never
    # commits them, and Vercel never uploads them (its command line reads .vercelignore, never .gitignore, and a plain site serves
    # every file it's given).
    mine = own_copies(folder)
    add_lines(os.path.join(folder, ".gitignore"), ["node_modules/", ".hwa/", ".vercel/", ".env*", "init.py", "init (*).py", "submit.py", "hwa-start.*", ".DS_Store", "dist/"] + mine)
    add_lines(os.path.join(folder, ".vercelignore"), [".hwa", "init.py", "init (*).py", "submit.py", "hwa-start.*"] + mine)


def setup_git(folder, login, uid):
    if not os.path.isdir(os.path.join(folder, ".git")):
        r = run(["git", "init", "-b", "main"], cwd=folder)
        if r.returncode != 0 or not os.path.isdir(os.path.join(folder, ".git")):
            # Git older than 2.28 has no -b.
            r = run(["git", "init"], cwd=folder)
            if r.returncode != 0:
                stop(f"Git couldn't start a repo in {folder}. {said(r, 300)}", ["Check you can make files in that folder (and that it isn't synced to OneDrive or iCloud)."])
            run(["git", "symbolic-ref", "HEAD", "refs/heads/main"], cwd=folder)
    # Your commits show your name and GitHub's private address for you, never your email.
    for key, value in (("user.name", CONFIG.get("name") or login), ("user.email", f"{uid}+{login}@users.noreply.github.com")):
        # "--": a name that starts with "-" is still a name, never read as one of git's options.
        r = run(["git", "config", "--", key, value], cwd=folder)
        if r.returncode != 0:
            stop(f"Git couldn't save your name for commits. {said(r, 300)}", [f"In {folder}, run: `git config {key} \"{value}\"`"])


def repo_on_github(gh, full):
    """The repo's description, visibility and whether it's empty, or None if there's no such repo."""
    r = run([gh, "repo", "view", full, "--json", "name,description,visibility,isEmpty"], timeout=120)
    if r.returncode == 0:
        try:
            return json.loads(r.stdout or "{}")
        except ValueError:
            return {}
    if re.search(r"could not resolve to a repository|not found|\b404\b", said(r), re.I):
        return None
    stop(f"Couldn't ask GitHub about github.com/{full}. {said(r, 300)}", ONLINE + [f"Check you're signed in: run `{q(gh)} auth status`"])


def setup_repo(gh, folder, login):
    """The public repo <register number>-hwa-hackathon: made here, or this entry's from an earlier run. Never someone else's."""
    full = f"{login}/{NAME}"
    seen = repo_on_github(gh, full)
    if seen is None:
        r = run([gh, "repo", "create", NAME, "--public", "--description", f"{REPO_NOTE} ({REPO_TAG})"], timeout=180)
        if r.returncode != 0:
            # Made a moment ago by another run, or a GitHub hiccup: look once more before giving up.
            seen = repo_on_github(gh, full)
            if seen is None:
                stop(f"GitHub didn't make the repo {NAME}. {said(r, 300)}", ONLINE + [f"Check you're signed in: run `{q(gh)} auth status`"])
        else:
            ok(f"Made the public repo github.com/{full}.")
    if seen is not None:
        note_ = seen.get("description") or ""
        if REPO_TAG in note_ or note_.strip() == REPO_NOTE:
            ok(f"The repo github.com/{full} is this entry's, from an earlier run: using it.")
        elif seen.get("isEmpty"):
            # Empty, so nothing in it can be lost: it becomes this entry's.
            run([gh, "repo", "edit", full, "--description", f"{REPO_NOTE} ({REPO_TAG})"], timeout=120)
            ok(f"The repo github.com/{full} is empty: using it for the hackathon.")
        else:
            stop(f"You already have a repo called {NAME} (github.com/{full}) that init.py didn't make for this entry, so it's left alone.", [f"Open https://github.com/{full}/settings and rename it (or delete it, if you don't need it)."])
        if (seen.get("visibility") or "PUBLIC").upper() != "PUBLIC":
            stop(f"github.com/{full} is private. The hackathon needs it public.", [f"Open https://github.com/{full}/settings, scroll to the bottom, press **Change visibility** and choose **Public**."])
    url = f"https://github.com/{full}.git"
    remotes = out(["git", "remote"], cwd=folder) or ""
    r = run(["git", "remote", "set-url" if "origin" in remotes.split() else "add", "origin", url], cwd=folder)
    if r.returncode != 0:
        stop(f"Git couldn't point your project at github.com/{full}. {said(r, 300)}", [f"In {folder}, run: `git remote add origin {url}`"])
    return f"https://github.com/{full}"


def ensure_vercel():
    """Vercel's tool: one already on this computer if it's recent, otherwise our own copy."""
    have = shutil.which("vercel", path=ENV["PATH"])
    if have and (version_of([have, "--version"]) or (0,)) >= (39, 0, 0):
        return have
    return npm_tool("vercel", None, "vercel")


def setup_vercel(folder):
    vercel = ensure_vercel()
    who = run([vercel, "whoami"], cwd=folder, timeout=120)
    if who.returncode != 0:
        note("web", "**Signing in to Vercel in your browser:**")
        numbered(["Your browser opens Vercel (if it doesn't, open the address it shows below).", "No Vercel account yet? Choose **Continue with GitHub**, with the same GitHub account. It's free (Hobby).", "Confirm in the browser, then come back here."])
        say("")
        run([vercel, "login"], cwd=folder, capture=False, timeout=900)
        who = run([vercel, "whoami"], cwd=folder, timeout=120)
        if who.returncode != 0:
            stop("You're not signed in to Vercel, so init.py can't make your Vercel project.", ["No Vercel account yet? Make a free one at https://vercel.com/signup: choose Hobby, then Continue with GitHub.", f"Sign in here: run `{q(vercel)} login` and confirm in the browser."])
    account = (who.stdout or "").strip().splitlines()[-1:] or [""]
    ok(f"Vercel account: **{account[0]}**")
    name = NAME
    linked = read_json(os.path.join(folder, ".vercel", "project.json")).get("projectName")
    if linked != name:
        r = run([vercel, "project", "add", name], cwd=folder, timeout=180)
        exists = r.returncode != 0 and re.search(r"already exists|conflict|\b409\b", said(r), re.I)
        if r.returncode != 0 and not exists:
            stop(f"Vercel didn't make the project {name}. {said(r, 300)}", ONLINE + [f"If you're in a Vercel team, use your own account: run `{q(vercel)} switch` and choose your own name."])
        if exists:
            # Most likely this entry's own project from an earlier run (on another computer, say). Vercel projects carry no
            # note to tell, so the person decides: using it deploys the hackathon site over whatever it holds.
            say(f"  A Vercel project called {name} is already in your Vercel account (likely from an earlier run of init.py).")
            if not yes_no("  Use it for the hackathon? Your site will be deployed to it. (Enter = yes, or type no): ", True):
                stop(f"You chose not to use the Vercel project {name}.", [f"Open https://vercel.com/dashboard, open {name}, then Settings: rename it (or delete it, if you don't need it)."])
        r = run([vercel, "link", "--yes", "--project", name], cwd=folder, capture=False, timeout=300)
        if r.returncode != 0 or not os.path.exists(os.path.join(folder, ".vercel", "project.json")):
            stop(f"Vercel couldn't link your project folder to the project {name} (the reason is just above).", ONLINE + [f"Or link it yourself: in {folder}, run `{q(vercel)} link --yes --project {name}`"])
    ok(f"Vercel project **{name}** linked. Your site's address is https://{name}.vercel.app: the hackathon takes only that one.")
    return name


def cmd_path(path):
    """A path as a .cmd file writes it: from %LOCALAPPDATA%, %APPDATA% or %USERPROFILE% where it can be, so the file stays plain
    ASCII whatever the user's name (cmd reads a .cmd file in the console's code page, not UTF-8), and a literal % doubled."""
    for var in ("LOCALAPPDATA", "APPDATA", "USERPROFILE"):
        base = os.environ.get(var)
        if base and path.lower().startswith(base.rstrip("\\").lower() + "\\"):
            return f"%{var}%" + path[len(base.rstrip("\\")):].replace("%", "%%")
    return path.replace("%", "%%")


def launchers(folder, opencode):
    """hwa-start: OpenCode in the project folder with the tools init.py set up, for any time later (a double-click on Windows)."""
    if WIN:
        lines = ["@echo off"]
        if ADDED:
            lines.append('set "PATH=' + ";".join(cmd_path(d) for d in ADDED) + ';%PATH%"')
        lines += ['cd /d "%~dp0"', f'"{cmd_path(opencode)}"']
        text = "\r\n".join(lines) + "\r\n"
        if not all(ord(c) < 128 for c in text):
            # A path that can't be written from a variable: the file in UTF-8, and cmd told to read it so.
            text = "@echo off\r\nchcp 65001 >nul\r\n" + "\r\n".join(lines[1:]) + "\r\n"
        # newline="" keeps the \r\n as written (Windows would otherwise write \r\r\n).
        with open(os.path.join(folder, "hwa-start.cmd"), "w", encoding="utf-8", newline="") as f:
            f.write(text)
    else:
        import shlex

        p = os.path.join(folder, "hwa-start.sh")
        path = "".join(shlex.quote(d) + ":" for d in ADDED)
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(f'#!/bin/sh\nexport PATH={path}"$PATH"\ncd "$(dirname "$0")" && export PWD="$(pwd)" && exec {shlex.quote(opencode)}\n')
        os.chmod(p, 0o755)


def folder_print(folder):
    """The folder's fingerprint, made as the collector makes it (its real path with no trailing slash; on Windows with / and in
    lower case), so the folder set up here and the folder a bundle comes from can be matched."""
    x = os.path.abspath(folder) if WIN else os.path.realpath(folder)
    x = x.rstrip("\\/") or x
    if WIN:
        x = x.replace("\\", "/").lower()
    return hashlib.sha256(x.encode("utf-8")).hexdigest()[:16]


# ---------- Free model keys ----------
# Free models run out during a long day, so init.py helps add two free keys to OpenCode, one provider at a time (the owner, 15 Nov
# 2026: "guide them to set up gemini and groq ... using opencode auth login twice"). Each as OpenCode 1.19.5 knows it: its id (the
# name in its auth.json, and what `opencode auth login --provider` takes), the name its list shows, the variables it reads a key
# from, and the page where the key is made.
PROVIDERS = (
    {
        "id": "google",
        "name": "Google",
        "title": "Google AI Studio (Gemini)",
        "env": ("GOOGLE_GENERATIVE_AI_API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY"),
        "page": "https://aistudio.google.com/apikey",
        "how": [
            "Sign in with your Google account (any Gmail works).",
            "Press **Create API key**. If it asks for a project, choose one or press **Create project** (any name), then **Create key**.",
            "Press the **copy** button beside your new key (a long code that starts with AIza).",
        ],
    },
    {
        "id": "groq",
        "name": "Groq",
        "title": "Groq",
        "env": ("GROQ_API_KEY",),
        "page": "https://console.groq.com/keys",
        "how": [
            "Sign in (with Google, GitHub or your email: it's free).",
            "Press **Create API Key**, type any name (like hackathon), and press **Submit**.",
            "Press **Copy** (Groq shows the key only once; it starts with gsk_).",
        ],
    },
)
PASTE = "**Cmd+V**" if MAC else "**Ctrl+V** (or right-click)" if WIN else "**Ctrl+Shift+V**"


def auth_file():
    """Where OpenCode keeps its logins: auth.json in its data folder, <XDG_DATA_HOME or ~/.local/share>/opencode, on every system
    (on Windows too, under the user's own folder), as OpenCode 1.19.5 has it."""
    base = os.environ.get("XDG_DATA_HOME") or os.path.join(HOME, ".local", "share")
    return os.path.join(base, "opencode", "auth.json")


def model_keys():
    """The providers OpenCode has a key for: the provider names in its auth.json (or in OPENCODE_AUTH_CONTENT, which it reads
    instead when that's set), and the providers whose key variable is set. Only the names: no key is ever printed, saved or sent,
    and init.py never asks for one."""
    saved = None
    if os.environ.get("OPENCODE_AUTH_CONTENT"):
        try:
            saved = json.loads(os.environ["OPENCODE_AUTH_CONTENT"])
        except ValueError:
            saved = None
    if not isinstance(saved, dict):
        saved = read_json(auth_file())
    names = {str(k) for k, v in saved.items() if isinstance(v, dict) and v.get("type")}
    saved = None
    for p in PROVIDERS:
        if any((os.environ.get(v) or "").strip() for v in p["env"]):
            names.add(p["id"])
    return names


def open_page(url):
    """A key page in the person's own browser. On Linux only with a desktop (or a BROWSER set), so no text browser ever takes over
    this window."""
    if not WIN and not MAC and not (os.environ.get("DISPLAY") or os.environ.get("WAYLAND_DISPLAY") or os.environ.get("BROWSER")):
        return False
    try:
        import webbrowser

        return bool(webbrowser.open(url, new=2))
    except Exception:
        return False


def in_terminal(cmd):
    """A tool that asks the person something in this window (OpenCode's key question). Ctrl+C belongs to it while it runs (it cancels
    the question), never to init.py."""
    import signal

    old = signal.signal(signal.SIGINT, lambda *_: None)
    try:
        return run(cmd, capture=False, timeout=900).returncode
    finally:
        signal.signal(signal.SIGINT, old)


def add_key(opencode, p, n, total):
    """One provider's free key, walked through: why, the key page opened for them, what to press there, then OpenCode's own key
    question (the key goes only there), and a check that it's set. Enter skips it."""
    say("")
    say(f"  {mark('key')} **Free key {n} of {total}: {p['title']}**")
    if not yes_no(f"  Set up your free {p['name']} key now? (type yes, or press Enter to skip it): ", False):
        note("skip", f"Skipped {p['name']}. Add it any time inside OpenCode: type `/connect` and choose {p['name']}.")
        return
    say("")
    note("web", f"Opening **{p['page']}** in your browser...")
    if not open_page(p["page"]):
        say("     It didn't open by itself: open that address in your browser.")
    say("  There:")
    numbered(p["how"])
    say("")
    a = ask("  When you've copied the key, press Enter here (don't paste it here: OpenCode asks for it next): ")
    if len(a) >= 20 and " " not in a:
        # Pasted here by mistake: not kept, not shown, not used.
        a = ""
        note("warn", "That looks like the key itself: it isn't kept here. Paste it in OpenCode's question, next.")
    for attempt in range(2):
        say("")
        note("do", f"**OpenCode now asks for your {p['name']} key:**")
        numbered([f"When it says **Enter your API key**, paste it with {PASTE}. It may show as dots, or nothing, as you paste.", "Press **Enter**.", f"If it shows a list of providers first, type **{p['name']}** and press **Enter**."])
        say("")
        in_terminal([opencode, "auth", "login"] + (["--provider", p["id"]] if attempt == 0 else []))
        say("")
        if p["id"] in model_keys():
            ok(f"**{p['title']} key saved in OpenCode.**")
            return
        note("warn", f"The {p['name']} key isn't in OpenCode yet.")
        if attempt or not yes_no("  Try again? (type yes, or press Enter to skip it for now): ", False):
            break
    note("skip", f"Skipped {p['name']} for now. Add it any time inside OpenCode: type `/connect` and choose {p['name']}.")


def model_keys_step(opencode):
    """After OpenCode is installed and before it opens: which free providers OpenCode already has a key for, and a walk through
    adding the missing ones (the owner, 15 Nov 2026: "it opens all studio and all files for them too !! it shld very easy for them
    setup")."""
    have = model_keys()
    for p in PROVIDERS:
        if p["id"] in have:
            ok(f"{p['title']}: a key is already in OpenCode.")
    missing = [p for p in PROVIDERS if p["id"] not in have]
    if not missing:
        ok("Both free keys are set: when one model runs out, switch to the other with **/models** in OpenCode.")
        return
    say("  Free models run out during a long day. Two free keys, Google's and Groq's, keep you going: when one runs out, switch to the other inside OpenCode with **/models**. OpenCode's own free models work without any key, too.")
    if not interactive():
        note("tip", "Add them later inside OpenCode: type `/connect` and choose Google, then Groq.")
        return
    for i, p in enumerate(missing, 1):
        add_key(opencode, p, i, len(missing))


def in_folder(folder):
    """Whether this terminal is in the project folder already."""
    try:
        return os.path.normcase(os.path.realpath(os.getcwd())) == os.path.normcase(os.path.realpath(folder))
    except OSError:
        return False


def start_command(folder, here):
    """How to start OpenCode again later, typed in this terminal."""
    if WIN:
        return "double-click **hwa-start.cmd** in your project folder, or run " + ("`.\\hwa-start.cmd`" if here else f"`{q(os.path.join(folder, 'hwa-start.cmd'))}`")
    return "run " + ("`./hwa-start.sh`" if here else f"`{q(os.path.join(folder, 'hwa-start.sh'))}`")


def main():
    logo("setup", f"init.py {VERSION}")
    need_config()
    say("")
    say(f"Hello{' ' + CONFIG['first'] if CONFIG.get('first') else ''}. This takes 5 to 15 minutes; it'll ask you to sign in to GitHub and Vercel in your browser, and help you add two free model keys.")

    step(1, "Your project folder")
    folder = project_folder()
    ok(f"Your project folder: **{folder}**")
    say("     Your site, OpenCode and submit.py all work in this folder.", 2)
    os.makedirs(TOOLS, exist_ok=True)
    links = tool_links()

    step(2, "Node")
    node = ensure_node(links)
    CONFIG["node"] = node
    step(3, "Git")
    ensure_git(links)
    step(4, f"OpenCode {CONFIG.get('opencode') or ''}".strip())
    opencode = ensure_opencode()
    step(5, "GitHub and your repo")
    gh = ensure_gh(links)
    login, uid = github_login(gh)
    ok(f"GitHub account: **{login}**")
    setup_git(folder, login, uid)
    write_files(folder, login, uid)
    repo = setup_repo(gh, folder, login)
    save_config(folder, repo=repo)
    step(6, "Vercel")
    vproject = setup_vercel(folder)
    save_config(folder, vercel=vproject)
    step(7, "Checking in")
    collector = os.path.join(folder, ".hwa", "hwa-collect.mjs")
    fetch(f"{SERVER}/hackathon/hwa-collect.mjs", collector, what="the hackathon's collector (hwa-collect.mjs)")
    # The site lists the collector's sha256 as it serves it now (with the tools' links): a copy that differs is never run.
    want = links.get("collector_sha256")
    with open(collector, "rb") as f:
        differs = bool(want) and hashlib.sha256(f.read()).hexdigest() != want
    if differs:
        os.remove(collector)
        stop("The collector downloaded isn't the hackathon site's own copy (its checksum differs), so it wasn't kept.", ONLINE)
    fetch(f"{SERVER}/hackathon/submit.py", os.path.join(folder, "submit.py"), what="submit.py")
    launchers(folder, opencode)
    tools = {"node": out([node, "--version"]), "opencode": out([opencode, "--version"]), "gh": (out([gh, "--version"]) or "").split("\n")[0], "os": KEY}
    for attempt in range(2):
        r = api("setup", github_login=login, repo_url=repo, vercel_project=vproject, folder=folder_print(folder), tools=tools)
        if r.get("error"):
            site_problem("Recording your setup on the hackathon site didn't work", r["error"])
        if not r.get("repo_problem"):
            break
        # A repo made a second ago can take a moment to show on GitHub's side.
        time.sleep(5)
    else:
        stop(f"The hackathon site can't see your repo {repo}: {r['repo_problem']}", [f"Open {repo} in a private browser window: it must open for anyone.", f"If it's private: open {repo}/settings, scroll to the bottom, **Change visibility**, **Public**."])
    # The token goes in the environment, never on the command line, where anyone on this computer could see it in the list of
    # running programs.
    env = dict(ENV, PWD=folder, HWA_TOKEN=CONFIG["token"])
    r = run([node, collector, "check", "-", "--server", SERVER], cwd=folder, env=env, capture=False, timeout=300)
    if r.returncode != 0:
        stop("The check-in didn't finish (the reason is just above).", ONLINE + ["If it says OpenCode wasn't found, close this terminal, open a new one in the same folder, and run init.py again."])
    ok("Checked in with the hackathon site.")

    step(8, "Free model keys")
    model_keys_step(opencode)

    say("")
    ok("**All set:**")
    say(f"       Project folder:  {folder}")
    say(f"       GitHub repo:     {repo}")
    say(f"       Vercel project:  {vproject}  (https://{vproject}.vercel.app)")
    if not interactive():
        next_steps(folder, opened=False)
        return
    say("")
    say("  **How OpenCode works here:**")
    numbered([
        "It opens in this window, in your project folder, and first reads the hackathon's rules.",
        "Pick a model: type **/models** and choose one (your free keys' models are there too). Switch any time one runs out.",
        "Type your own prompts. Ask it to commit, push and deploy as you go: your repo and Vercel project are ready.",
        "When you're done, leave OpenCode: type **/exit** and press **Enter**.",
        "Then send your entry with submit.py (this window says how when OpenCode closes).",
    ])
    if not yes_no("\n  Start OpenCode in your project folder now? (Enter = yes, or type no): ", True):
        next_steps(folder, opened=False)
        return
    note("go", "Starting OpenCode...")
    clear_for_full_screen()
    code_ = opencode_session(opencode, folder, env)
    back_from_full_screen()
    if code_ not in (0, None):
        note("warn", f"OpenCode stopped with an error (code {code_}).")
    next_steps(folder, opened=True)


def opencode_session(opencode, folder, env):
    """OpenCode in this window, with the first prompt. While it runs, Ctrl+C belongs to OpenCode (it stops the agent's reply), so
    it never stops init.py, and nothing is killed. Answers OpenCode's exit code."""
    import signal

    try:
        p = subprocess.Popen([opencode, "--prompt", FIRST_PROMPT], cwd=folder, env=env)
    except OSError as e:
        stop(f"OpenCode couldn't start ({e}).", ["Close this terminal, open a new one in the same folder, and run init.py again."], again=False)
    old = signal.signal(signal.SIGINT, lambda *_: None)
    try:
        return p.wait()
    finally:
        signal.signal(signal.SIGINT, old)


def next_steps(folder, opened):
    """What to do next, after OpenCode closes or when it wasn't started (the owner, 15 Nov 2026: "add in bold submit.py and gaps and
    all"): set off from the rest, numbered, with gaps, the command in bold. They're in the project folder already, so there's no cd
    (one is added only when this terminal is somewhere else)."""
    here = in_folder(folder)
    start = start_command(folder, here)
    steps = []
    if not here:
        steps.append(f"Go to your project folder: `cd \"{folder}\"`")
    if not opened:
        steps.append(f"Start OpenCode: {start}\nBuild your site with it, then leave it: type **/exit** and press **Enter**.")
    steps.append(f"{'In' if here else 'Then, in'} this same terminal, run: `{'py' if WIN else 'python3'} submit.py`\nIt saves your work's bundle first, then commits, pushes, deploys and sends your entry, and tells you if anything's missing.")
    steps.append("Check what it shows, and type **yes** when it asks. Your hackathon page then says **Submitted**.")
    head = f"{mark('party')} **OpenCode has closed. Next, send your entry:**" if opened else f"{mark('do')} **Next:**"
    rows = [head]
    for i, s in enumerate(steps, 1):
        first, *rest = s.split("\n")
        rows += ["", f"  **{i}.** {first}"] + [f"     {more}" for more in rest]
    if opened:
        rows += ["", f"Not finished yet? Start OpenCode again: {start}"]
    block(rows)


def unexpected(e):
    """Never a wall of Python: the details go to a file, and the person gets one line and what to do."""
    import traceback

    where = os.path.join(TOOLS, "init-error.txt")
    try:
        os.makedirs(TOOLS, exist_ok=True)
        with open(where, "w", encoding="utf-8") as f:
            f.write(f"init.py {VERSION} on {KEY}, Python {platform.python_version()}\n\n{traceback.format_exc()}")
    except OSError:
        where = None
    stop(f"Something unexpected went wrong ({type(e).__name__}: {str(e)[:200]}).", ([f"If it happens again, email us the file {where} (it holds no keys)."] if where else []))


if __name__ == "__main__":
    look()
    try:
        main()
    except KeyboardInterrupt:
        settle()
        say("")
        say("Stopped. Run init.py again any time: what's done is kept.")
        sys.exit(130)
    except Exception as e:
        unexpected(e)
