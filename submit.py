#!/usr/bin/env python3
"""Happy While Away hackathon: send your entry at the end.

Run it in your project folder, the folder init.py is in (init.py put submit.py there):
  Mac or Linux:  python3 submit.py
  Windows:       py submit.py

First it saves your bundle (your OpenCode sessions, packaged by our collector, which shows you what it found), before anything
that could go wrong. Then it commits and pushes anything left, deploys to Vercel only if your live site is behind your latest
commit, saves your repo and live site, sends the bundle, and submits after you type yes. If anything fails, it says what's
wrong and how to fix it, and since the bundle is already saved, you can always finish by hand on the hackathon page.
"""
import hashlib
import json
import os
import re
import shutil
import ssl
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from urllib.parse import urlsplit

VERSION = "1.4.0"
# Python from python.org on a Mac often has no certificates: then the system's own bundle is used (macOS keeps one at
# /etc/ssl/cert.pem; Linux at /etc/ssl/certs).
_CTX = None


# submit.py talks only to the hackathon site, over https (plain http only to this computer itself, the tests' stand-in), and
# follows no redirect anywhere else.
LOCAL = ("127.0.0.1", "localhost", "::1")


def trusted(url):
    try:
        u = urlsplit(url)
        host = (u.hostname or "").lower()
    except ValueError:
        return False
    if host in LOCAL:
        return u.scheme in ("http", "https")
    return u.scheme == "https" and host == (urlsplit(SERVER).hostname or "").lower()


class _Checked(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not trusted(newurl):
            raise urllib.error.URLError(f"a redirect to {urlsplit(newurl).hostname or 'another address'} was refused")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def urlopen(req, timeout):
    global _CTX
    url = req.full_url if isinstance(req, urllib.request.Request) else str(req)
    if not trusted(url):
        raise urllib.error.URLError(f"{urlsplit(url).hostname or url} isn't the hackathon site's secure address")

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


HERE = os.path.dirname(os.path.abspath(__file__))
WIN = os.name == "nt"
RUN_AGAIN = "py submit.py" if WIN else "python3 submit.py"
ONLINE = ["Check this computer is online: open https://github.com in a browser.", "On a campus or office network, try a phone hotspot."]
CONFIG = {}
SERVER = "https://apply-happywhileaway.vercel.app"
ENV = dict(os.environ)
# Where the bundle was saved, once it is: from then on every stop also says how to finish by hand.
BUNDLE = None


# ---------- How it looks ----------
# The same look as init.py (the owner, 15 Nov 2026), from the standard library alone. Plain text with ASCII marks when the output
# isn't a terminal, TERM is dumb or NO_COLOR is set. look() sets these at the start.
TTY = False  # a terminal that reads escape codes: every line then starts on a clean line
COLOR = False  # colours and bold
EMOJI = False  # emoji marks (otherwise [ok], [x], ->)
DEEP = False  # 24-bit colour (otherwise the nearest of the 256 colours)
UTF = False  # UTF-8 output (the logo and the bar beside what matters most need it)

# The brand's logo, exactly as OpsHub's `hwa help` draws it (its cli/hwa_cli/ui.py), written in plain ASCII as in init.py: # the
# full block, = and | the double lines, [ ] { } the four corners.
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
    emoji = color and utf and term != "linux" and (not win or bool(env.get("WT_SESSION")) or env.get("TERM_PROGRAM") == "vscode")
    deep = color and (env.get("COLORTERM", "").lower() in ("truecolor", "24bit") or bool(env.get("WT_SESSION")))
    return ansi, color, emoji, deep, utf


def vt_on():
    """Windows 10 and later draw colours once the console is told to read escape codes (virtual terminal processing)."""
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
    """Our light markup, drawn: **bold**, and `a command` in bold on the accent colour. In plain text the marks just go."""
    out_, at = [], 0
    for m in _MARKUP.finditer(text):
        out_.append(paint(text[at:m.start()], *base))
        if m.group(1) is not None:
            out_.append(paint(m.group(1), *(base + (1,))))
        else:
            out_.append(paint(" " + m.group(2) + " ", 1, rgb(INK), rgb(ACCENT, back=True)) if COLOR else m.group(2))
        at = m.end()
    out_.append(paint(text[at:], *base))
    return "".join(out_)


def _out(s):
    try:
        sys.stdout.write(s)
    except UnicodeEncodeError:
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
    """One finished line. In a terminal it starts by clearing its row, so it never runs into text already there (a tool's spinner)."""
    for row in fit(text):
        _out(("\r\x1b[K" if TTY else "") + row + "\n")


def say(text="", *base):
    for row in str(text).split("\n"):
        line(md(row, *base))


def mark(kind):
    emoji, plain, color = MARKS[kind]
    return emoji if EMOJI else paint(plain, 1, color)


def ok(text):
    say(f"   {mark('ok')} {text}")


def note(kind, text):
    say(f"   {mark(kind)} {text}")


STEPS = 5


def step(n, title):
    """Each step's coloured header, with a blank line above it."""
    say("")
    if COLOR:
        dot = "\u00b7" if UTF else ":"
        line(paint(f" Step {n} of {STEPS} {dot} {title} ", 1, rgb("#ffffff"), rgb(EDGE, back=True)))
    else:
        say(f"[Step {n} of {STEPS}] {title}")


def numbered(items, indent=4):
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
    """After a tool that drew in this window (the collector, a spinner, a browser sign-in): colours off and the cursor shown again."""
    if TTY:
        _out("\x1b[0m\x1b[?25h")


# ---------- Talking to the person ----------
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
    main_, hint = (body[:cut], body[cut:]) if cut > 0 else (body, "")
    return f"{lead}{mark('do')} {md(main_, 1)}{paint(hint, 2)} "


def ask(question, default=""):
    """A question and the answer typed (Enter gives the default). With no terminal to type in, nothing typed ends the line, so
    it's ended here and the next line never runs into the question."""
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


def word(answer):
    return re.sub(r"[^a-z]", "", answer.lower())


def yes_no(question, default):
    """A yes-or-no question that can't trap anyone: Enter gives the default, yes or y, no or n, and anything else is explained
    and asked again (a few times, then the default)."""
    for _ in range(3):
        a = word(ask(question))
        if not a:
            return default
        if a in YES:
            return True
        if a in NO:
            return False
        say("   Please type yes or no (or press Enter).")
    say(f"   Taken as {'yes' if default else 'no'}.")
    return default


def web_address(text):
    """A typed or pasted site address as https://..., or None. "your-site.vercel.app" and http:// are fine: they become https://."""
    t = text.strip().strip("<>\"'").rstrip("/.,")
    t = re.sub(r"^http://", "https://", t, flags=re.I)
    if not re.match(r"^https://", t, re.I):
        t = "https://" + t
    m = re.match(r"^https://([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)(?::\d+)?(?:/\S*)?$", t)
    return t if m and re.search(r"\.[A-Za-z]{2,}$", m.group(1)) else None


def one_deployment(site, guess):
    """A deployment's own Vercel address for this project (like name-ab12cd3ef-team-projects.vercel.app, or name-git-main-team.vercel.app),
    never the site's address: it asks visitors to sign in to Vercel. The hackathon takes only the project's address."""
    host = re.sub(r"^https://", "", site, flags=re.I).split("/")[0].lower()
    name = re.sub(r"^https://", "", guess, flags=re.I).split("/")[0].lower()
    if not name.endswith(".vercel.app") or not host.endswith(".vercel.app") or host == name:
        return False
    stem = name[: -len(".vercel.app")]
    return host.startswith(stem + "-") and bool(re.search(r"-[a-z0-9]{9}-[a-z0-9-]+\.vercel\.app$|-git-", host))


def site_address(guess):
    """The live site's address: Enter, yes or y keep the one shown; a pasted address is used; anything else is explained and
    asked again, and after a few tries the one shown is used (the hackathon site then checks it opens). Never a stop."""
    question = f"   Your live site [{guess}] (Enter or yes to use it, or paste the address): "
    for _ in range(4):
        a = ask(question)
        if not a or word(a) in YES:
            return guess
        if word(a) in NO:
            question = "   Paste your live site's address, like https://your-site.vercel.app (or press Enter to use the one shown): "
            continue
        site = web_address(a)
        if site and one_deployment(site, guess):
            say(f"   That's one deployment's own address (Vercel adds letters and your team's name to it): it asks visitors to sign in.")
            say(f"   Your site's address is {guess}, so that's the one used.")
            return guess
        if site:
            return site
        say(f"   \"{a[:60]}\" isn't a web address. Press Enter to use {guess}, or paste the full address (like https://your-site.vercel.app).")
    say(f"   Using {guess}.")
    return guess


def q(path):
    """A program's path as it's typed in this computer's terminal: quoted if it has a space (PowerShell runs a quoted path with &)."""
    if " " not in path:
        return path
    return f'& "{path}"' if WIN else f'"{path}"'


def shown(name):
    """How to type a tool in this person's own terminal: its name if their PATH finds it, otherwise its full path."""
    if shutil.which(name):
        return name
    found = which(name)
    return q(found) if found else name


def by_hand():
    """The way to finish without submit.py: the bundle is saved, so nothing is lost."""
    git, vercel = shown("git"), shown("vercel")
    block([
        f"{mark('tip')} **Your bundle is saved, so you can always finish by hand:**",
        f"{BUNDLE}",
        "",
        f"**1.** Push your code: in this folder run `{git} add -A` then `{git} commit -m \"Final\"` then `{git} push`",
        f"**2.** Deploy your site: in this folder run `{vercel} --prod`",
        f"**3.** Open {SERVER}/hackathon, then \"submit.py didn't work? Do it here instead\": save your repo, save your site, choose the bundle file above, and press **Submit my entry**.",
    ])


def stop(problem, steps=(), again=True):
    """Every problem ends here: what's wrong, how to fix it in short numbered steps, then submit.py stops."""
    todo = list(steps) + ([f"Run submit.py again: `{RUN_AGAIN}` (it starts by saving a fresh bundle; nothing is sent twice)."] if again else [])
    wrong = paint("What's wrong:", 1, 31)
    say("")
    first, *rest = str(problem).split("\n")
    line(f"   {mark('bad')} {wrong} {md(first, 1)}")
    for more in rest:
        # A tool's own words (a git or Vercel error), as it wrote them, each on its own clean line.
        line("      " + more)
    if todo:
        say("")
        say("   **How to fix it:**")
        numbered(todo, 5)
    if BUNDLE:
        by_hand()
    say("")
    say("   Stuck? Email hello@happywhileaway.com from the email you joined with, with a photo of this window" + (" and the bundle file." if BUNDLE else "."), 2)
    sys.exit(1)


def run(cmd, capture=True, timeout=900, env=None):
    """Run a command (a list), never through a shell, with the program looked up on our PATH. Always answers; a program that's
    missing or too slow comes back as a failure with the reason."""
    cmd = list(cmd)
    if not os.path.dirname(cmd[0]):
        cmd[0] = which(cmd[0]) or cmd[0]
    try:
        return subprocess.run(cmd, cwd=HERE, env=env or ENV, capture_output=capture, text=True, timeout=timeout, encoding="utf-8", errors="replace")
    except OSError as e:
        return subprocess.CompletedProcess(cmd, 127, "", f"{os.path.basename(cmd[0])} couldn't start ({e})")
    except subprocess.TimeoutExpired:
        return subprocess.CompletedProcess(cmd, 124, "", f"{os.path.basename(cmd[0])} didn't finish within {timeout // 60} minutes")
    finally:
        if not capture:
            settle()


def said(r, most=600):
    return ((r.stderr or "") + "\n" + (r.stdout or "")).strip()[-most:] if r else ""


def out(cmd):
    r = run(cmd)
    return (r.stdout or "").strip() if r.returncode == 0 else ""


def which(name):
    for folder in ENV.get("PATH", "").split(os.pathsep):
        for ext in ([".exe", ".cmd", ""] if WIN else [""]):
            p = os.path.join(folder, name + ext)
            if os.path.isfile(p):
                return p
    return None


def api(op, **fields):
    body = json.dumps({"op": op, "token": CONFIG.get("token"), **fields}).encode()
    req = urllib.request.Request(f"{SERVER}/api/hackathon/cli", data=body, headers={"Content-Type": "application/json", "User-Agent": f"hwa-submit/{VERSION}"})
    try:
        with urlopen(req, 180) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        try:
            return {"error": json.loads(e.read() or b"{}").get("error", f"the site answered {e.code}")}
        except Exception:
            return {"error": f"the site answered {e.code}"}
    except Exception as e:
        return {"error": f"couldn't reach the hackathon site ({getattr(e, 'reason', None) or e})"}


def site_said(what, error):
    if "reach" in error:
        stop(f"{what}: {error}.", ONLINE)
    stop(f"{what}: {error}", ["Wait a minute (the site may be busy)."])


# ---------- 1. The bundle, first ----------
COLLECTOR = None


def collector():
    """The collector init.py saved, refreshed from the site if it answers quickly (a newer one may fix something). A new copy
    replaces the saved one only if it is byte for byte the one the site lists by its sha256 (with the tools' links, so the
    bundle is still made before the site is asked anything about the entry); otherwise the saved copy is used."""
    global COLLECTOR
    path = os.path.join(HERE, ".hwa", "hwa-collect.mjs")
    if COLLECTOR:
        return COLLECTOR
    try:
        with urlopen(urllib.request.Request(f"{SERVER}/hackathon/hwa-collect.mjs", headers={"User-Agent": f"hwa-submit/{VERSION}"}), 20) as r:
            data = r.read()
        with urlopen(urllib.request.Request(f"{SERVER}/api/hackathon/tools", headers={"User-Agent": f"hwa-submit/{VERSION}"}), 20) as r:
            want = (json.loads(r.read() or b"{}") or {}).get("collector_sha256")
        if b"hwa-collect" in data and ((want and hashlib.sha256(data).hexdigest() == want) or (not want and not os.path.exists(path))):
            with open(path, "wb") as f:
                f.write(data)
    except Exception:
        pass
    if not os.path.exists(path):
        stop("The collector (.hwa/hwa-collect.mjs) isn't in this folder, and the site couldn't send a new one.", ONLINE + ["Or run init.py again in this folder: it puts the collector back."], again=True)
    COLLECTOR = path
    return path


def with_token():
    """The collector's environment: the token goes there, never on the command line, where anyone on this computer could see it
    in the list of running programs."""
    return dict(ENV, HWA_TOKEN=CONFIG.get("token") or "")


def node():
    exe = CONFIG.get("node") if CONFIG.get("node") and os.path.isfile(CONFIG["node"]) else which("node")
    if not exe or run([exe, "--version"]).returncode != 0:
        stop("Node, which makes the bundle, wasn't found on this computer.", ["Run init.py again in this folder: it sets Node up and keeps everything else."])
    return exe


def make_bundle(sessions=None):
    """The collector saves the bundle (it shows what it found, and asks which sessions to leave out). Answers its report:
    where the file is, its fingerprint, and the sessions in it."""
    report = os.path.join(tempfile.mkdtemp(), "report.json")
    extra = ["--sessions", ",".join(sessions), "--yes"] if sessions else []
    r = run([node(), collector(), "submit", "-", "--from-submit-py", "--save-only", "--report", report, "--server", SERVER] + extra, capture=False, timeout=1800, env=with_token())
    try:
        with open(report, encoding="utf-8") as f:
            made = json.load(f)
    except (OSError, ValueError):
        made = None
    if r.returncode != 0 or not made or not os.path.exists(made.get("file") or ""):
        return None
    return made


# ---------- 2. Your code on GitHub ----------
def git(*args, capture=True, timeout=300):
    # Never a password prompt: a push that isn't signed in fails with a reason instead of waiting.
    return run(["git"] + list(args), capture=capture, timeout=timeout)


def gh_cmd():
    return shown("gh")


def push_failed(r, branch):
    """Why a push failed, and the fix."""
    text = said(r, 2000)
    sign_in = [f"Check you're signed in to GitHub: run `{gh_cmd()} auth status`", f"If it says you're not, run `{gh_cmd()} auth login --web` then `{gh_cmd()} auth setup-git`"]
    if re.search(r"could not read Username|Authentication failed|Permission to .* denied|\b403\b|terminal prompts disabled", text, re.I):
        stop("GitHub didn't accept the push: this computer isn't signed in to GitHub as the repo's owner.", sign_in)
    if re.search(r"Repository not found|does not appear to be a git repository", text, re.I):
        stop("GitHub says your repo isn't there (deleted, renamed or private?).", ["Run init.py again in this folder: it makes the repo again (or finds it) and keeps everything else."])
    if re.search(r"Could not resolve host|unable to access|timed out|Connection (refused|reset)", text, re.I):
        stop(f"Couldn't reach GitHub to push. {text[-300:]}", ONLINE)
    stop(f"Pushing to GitHub didn't work. {text[-400:]}", sign_in)


def git_up():
    """Everything committed, on main, pushed, and GitHub holding exactly this commit (the owner, 14 Nov 2026: "if commit is not
    ran, if push is not done ... ensure that the terminal guides them")."""
    if not which("git"):
        stop("Git wasn't found on this computer.", ["Run init.py again in this folder: it sets Git up and keeps everything else."])
    if not os.path.isdir(os.path.join(HERE, ".git")):
        stop("This folder isn't a git repo.", ["Run init.py again in this folder: it sets git up and keeps everything else."])
    branch = out(["git", "symbolic-ref", "--short", "HEAD"])
    if not branch:
        stop("Your project isn't on a branch right now (git calls it a detached HEAD).", ["In this folder run `git switch main` (or ask OpenCode to put your work back on main)."])
    # A name for commits (init.py set one; this is in case it's gone).
    if not out(["git", "config", "user.email"]) and CONFIG.get("github"):
        git("config", "user.name", CONFIG.get("name") or CONFIG["github"])
        git("config", "user.email", f"{CONFIG.get('github_id') + '+' if CONFIG.get('github_id') else ''}{CONFIG['github']}@users.noreply.github.com")

    changes = out(["git", "status", "--porcelain"])
    if changes:
        say(f"   {len(changes.splitlines())} changed files aren't committed yet.")
        if not yes_no("   Commit them now? (Enter = yes, or type no): ", True):
            note("warn", "Left as they are: they won't be in your repo or on your site.")
        else:
            message = ask("   A short message for the commit (Enter = 'Final changes'): ", "Final changes")
            if word(message) in YES:
                message = "Final changes"
            r = git("add", "-A")
            if r.returncode == 0:
                r = git("commit", "-m", message)
            if r.returncode != 0:
                stop(f"The commit didn't work. {said(r, 400)}", ["Commit in this folder yourself (or ask OpenCode to): `git add -A`, then `git commit -m \"Final\"`."])
            ok("Committed.")
    if not out(["git", "rev-parse", "--verify", "HEAD"]):
        stop("There are no commits yet, so there's nothing to push.", ["Commit your work first (ask OpenCode to commit and push)."])

    # The work belongs on main (the first prompt asks OpenCode to merge every branch into it).
    if branch != "main" and git("rev-parse", "--verify", "--quiet", "refs/heads/main").returncode == 0:
        say(f"   Your work is on the branch {branch}, not on main.")
        if not yes_no(f"   Merge {branch} into main now? (Enter = yes, or type no): ", True):
            say(f"   Left on {branch}: it's pushed as it is, and main stays as it was.")
        else:
            r = git("checkout", "main")
            if r.returncode != 0:
                stop(f"Couldn't switch to main. {said(r, 300)}", [f"Ask OpenCode to merge {branch} into main, commit and push."])
            r = git("merge", "--no-edit", branch)
            if r.returncode != 0:
                git("merge", "--abort")
                git("checkout", branch)
                stop(f"{branch} and main changed the same lines, so they can't be merged by themselves. Nothing was changed.", [f"Ask OpenCode: merge {branch} into main, fix the conflicts, commit and push."])
            branch = "main"
            ok("Merged into main.")

    # As configured (get-url would apply a user's own url rewrites, like ssh for github.com).
    remote = out(["git", "config", "--get", "remote.origin.url"])
    if not remote and CONFIG.get("repo"):
        git("remote", "add", "origin", CONFIG["repo"] + ".git")
        remote = out(["git", "config", "--get", "remote.origin.url"])
        ok(f"Your project now points at {CONFIG['repo']} again.")
    m = re.search(r"github\.com[:/]+([^/]+)/([^/\s]+?)(?:\.git)?/?$", remote)
    if not m:
        stop(f"Your project doesn't point at a GitHub repo ({remote or 'none'}).", ["Run init.py again in this folder: it points the project at your repo and keeps everything else."])

    note("wait", "Pushing to GitHub...")
    r = git("push", "-u", "origin", branch, timeout=600)
    if r.returncode != 0 and re.search(r"fetch first|non-fast-forward|rejected", said(r, 2000), re.I) and not re.search(r"denied|403", said(r, 2000)):
        say("   GitHub has commits this folder doesn't (made on github.com, or on another computer).")
        if not yes_no("   Bring them in and push again? (Enter = yes, or type no): ", True):
            stop("Your push was refused: GitHub has commits this folder doesn't.", [f"In this folder run `git pull --no-rebase origin {branch}` (or ask OpenCode to pull and fix any conflicts), then push."])
        p = git("pull", "--no-rebase", "--no-edit", "origin", branch, timeout=600)
        if p.returncode != 0:
            git("merge", "--abort")
            unrelated = "unrelated histories" in said(p, 2000)
            stop("GitHub's copy and this folder have different histories (an older project in the same repo?)." if unrelated else "GitHub's commits and yours changed the same lines, so they can't be joined by themselves. Nothing was changed.",
                 [f"Ask OpenCode: pull from origin {branch}, fix the conflicts, commit and push."] if not unrelated else ["Email us with a photo of this window: we'll sort out the repo with you."])
        r = git("push", "-u", "origin", branch, timeout=600)
    if r.returncode != 0:
        push_failed(r, branch)
    head = out(["git", "rev-parse", "HEAD"])
    there = out(["git", "ls-remote", "origin", f"refs/heads/{branch}"]).split("\t")[0]
    if there and there != head:
        stop("The push finished, but GitHub doesn't have your latest commit.", ["Wait a minute (GitHub may be slow)."])
    return f"https://github.com/{m.group(1)}/{m.group(2)}", head


# ---------- 3. Your live site ----------
def production(vercel, head):
    """What the project's live (production) deployment holds, from Vercel's own list: every deploy from a git folder (OpenCode's,
    submit.py's, or GitHub's) records its commit. Answers (state, deployment): "current" (it's of head), "building" (head is being
    deployed now), "behind" (an older commit), "none" (never deployed), or "unknown" (Vercel's list couldn't be read, or the live
    deploy had uncommitted changes or no commit)."""
    r = run([vercel, "ls", "--environment", "production", "--format", "json", "--limit", "20", "--yes"], timeout=120)
    text = (r.stdout or "") if r.returncode == 0 else ""
    try:
        data = json.loads(text[text.index("{"):])
    except ValueError:
        return "unknown", None
    found = [d for d in data.get("deployments") or [] if isinstance(d, dict) and d.get("target") == "production"]
    found.sort(key=lambda d: d.get("createdAt") or 0, reverse=True)
    for d in found:
        meta = d.get("meta") if isinstance(d.get("meta"), dict) else {}
        sha = meta.get("githubCommitSha") or meta.get("gitlabCommitSha") or meta.get("bitbucketCommitSha") or ""
        dirty = str(meta.get("gitDirty") or "").lower() in ("1", "true")
        state = str(d.get("state") or d.get("readyState") or "").upper()
        if state in ("BUILDING", "QUEUED", "INITIALIZING"):
            if sha == head and not dirty:
                return "building", d
            continue
        if state == "READY":
            if not sha or dirty:
                return "unknown", d
            return ("current" if sha == head else "behind"), d
        # A deploy that failed or was cancelled never went live: the one before it is what visitors see.
    return ("none" if isinstance(data.get("deployments"), list) else "unknown"), None


def live_alias(vercel, deployment, name):
    """The project's address, https://<project>.vercel.app, when the live deployment has it (the only address the hackathon takes;
    never the deployment's own one-off address)."""
    if not deployment or not deployment.get("url"):
        return None
    r = run([vercel, "inspect", deployment["url"], "--json"], timeout=120)
    text = r.stdout or ""
    try:
        aliases = [a for a in json.loads(text[text.index("{"):]).get("aliases") or [] if isinstance(a, str) and a.endswith(".vercel.app") and a != deployment["url"]]
    except ValueError:
        return None
    return f"https://{name}.vercel.app" if f"{name}.vercel.app" in aliases else None


def deploy(head):
    """The latest deployed to the Vercel project init.py made, only when the live site is behind the commit just pushed (OpenCode
    usually deploys as it goes), and the live address (the one Vercel really gave it)."""
    vercel = which("vercel")
    linked = {}
    try:
        with open(os.path.join(HERE, ".vercel", "project.json"), encoding="utf-8") as f:
            linked = json.load(f)
    except (OSError, ValueError):
        pass
    name = linked.get("projectName") or CONFIG.get("vercel") or CONFIG.get("project") or os.path.basename(HERE).lower()
    guess = f"https://{name}.vercel.app"
    if not vercel:
        note("warn", "Vercel's tool wasn't found on this computer, so submit.py can't deploy for you.")
        say("   (Run init.py again in this folder to set it up.) If your site is already live, give its address below.")
        return site_address(guess)
    if not linked:
        say(f"   This folder isn't linked to your Vercel project yet: linking it to {name}...")
        r = run([vercel, "link", "--yes", "--project", name], capture=False, timeout=300)
        if r.returncode != 0:
            stop(f"Vercel couldn't link this folder to the project {name} (the reason is just above).", [f"In this folder run `{shown('vercel')} login` if it says you're not signed in, then `{shown('vercel')} link --yes --project {name}`"])

    # The owner, 15 Nov 2026: "If there are no changes, if everything is committed and pushed, and then it doesn't have to deploy
    # again." So Vercel is asked what's live first, and a deploy happens only when the live site is behind.
    note("wait", "Checking what your live site is running...")
    state, live = production(vercel, head)
    if state == "building":
        note("wait", f"Vercel is already deploying your latest commit ({head[:7]}): waiting for it to finish...")
        r = run([vercel, "inspect", live["url"], "--wait", "--timeout", "10m"], timeout=900)
        state = "current" if r.returncode == 0 else "behind"
    if state == "current":
        ok(f"Your live site is already up to date: it's running your latest commit ({head[:7]}), so there's nothing to deploy.")
        return site_address(live_alias(vercel, live, name) or guess)
    if state == "behind":
        sha = ((live or {}).get("meta") or {}).get("githubCommitSha") or ""
        say(f"   Your live site is running an older commit{f' ({sha[:7]})' if sha else ''}; your latest is {head[:7]}.")
        go = yes_no("   Deploy the latest to Vercel now? (Enter = yes, or type no): ", True)
    elif state == "none":
        say("   Your site hasn't been deployed yet.")
        go = yes_no("   Deploy it to Vercel now? (Enter = yes, or type no): ", True)
    else:
        go = yes_no("   Your site may already be current. Deploy again? (Enter = no, or type yes): ", False)
    if not go:
        say("   Not deployed now: your site stays as it was last deployed.")
    else:
        note("wait", "Deploying (a minute or two)...")
        r = run([vercel, "--prod", "--yes"], timeout=900)
        if r.returncode != 0 and re.search(r"credentials|not logged in|vercel login|token is not valid|not authorized", said(r, 3000), re.I):
            note("warn", "Vercel needs you to sign in again: your browser opens Vercel; confirm there, then come back here.")
            run([vercel, "login"], capture=False, timeout=900)
            r = run([vercel, "--prod", "--yes"], timeout=900)
        text = said(r, 100000)
        if r.returncode == 0:
            # The site's address is exactly https://<project>.vercel.app (the hackathon takes only that one), whatever else the deploy prints.
            ok("Deployed.")
        else:
            note("bad", "The deploy didn't work:")
            # Vercel's own words, as it wrote them (never read as markup).
            for row in text.strip()[-800:].split("\n"):
                line(row)
            say("   Fix it with OpenCode (show it the error above), then run submit.py again. Or, if an earlier deploy is live, give its address below.")
    if not go and live:
        guess = live_alias(vercel, live, name) or guess
    return site_address(guess)


def entry_refused(error):
    """The site wouldn't take the repo or the live site: why, and the fix."""
    if "one deployment" in error.lower() or "project's address" in error.lower():
        stop(f"Your live site wasn't accepted: {error}", ["Run submit.py again and press Enter to use the address it shows (your project's address, ending .vercel.app)."])
    if re.search(r"\b40[13]\b|login|protect|password", error, re.I):
        stop(f"Your repo or live site wasn't accepted: {error}", ["Your site needs a sign-in to open. In Vercel, open your project, **Settings**, **Deployment Protection**, and turn **Vercel Authentication** off.", "Open the address in a private browser window to check it opens for anyone."])
    if "repo" in error.lower():
        stop(f"Your repo wasn't accepted: {error}", ["Check it opens for anyone: open it in a private browser window. If it's private: on github.com, Settings, Change visibility, Public."])
    site_said("Your repo or live site wasn't accepted", error)


def main():
    global BUNDLE
    say("")
    say(f"   Project folder: **{HERE}**")

    # The owner, 14 Nov 2026: "the submit script, first thing it should do is create the bundle ... in case nothing happens,
    # they can push GitHub by themselves, create one Versal and just add the logs". So the bundle comes before anything that
    # can fail: the site, git, the deploy. Only sending it waits (the site takes a bundle once the repo and site are in).
    step(1, "Your bundle: your OpenCode sessions, saved first")
    made = make_bundle()
    if not made:
        stop("No bundle was made (the reason is just above).", ["Run submit.py in your project folder: the folder init.py is in, where you started OpenCode.", "If it says no sessions were found, start OpenCode once in this folder, then try again."])
    BUNDLE = made["file"]
    ok(f"Saved: {BUNDLE}")

    status = api("status")
    if status.get("error"):
        if "token" in status["error"].lower():
            # One fix: a new init.py, run in this same folder, keeps everything and puts a new submit.py here.
            stop("**Your token was changed on the hackathon page, so this submit.py's copy no longer works.**", [f"**Download your init.py again:** open {SERVER}/hackathon, sign in, and press **Download my init.py**.", "Save it in this folder, over the old one, as init.py, and run it: `" + ("py init.py" if WIN else "python3 init.py") + "`. It keeps everything and updates submit.py.", f"Then run submit.py again: `{RUN_AGAIN}`"], again=False)
        site_said("The hackathon site couldn't be asked about your entry", status["error"])
    if status.get("sent_back"):
        note("warn", f"Your entry was sent back for corrections: {status['sent_back'].get('reason') or 'see the hackathon page'}.")
        say("   This sends it again; the new one replaces the old.")
    if status.get("submitted_at"):
        stop("Your entry is already submitted. Nothing more can change.", again=False)
    if not status.get("consented"):
        stop("Your details aren't saved on the hackathon page yet.", [f"Open {SERVER}/hackathon, tick the two boxes in Your details (18 or older, and the agreement), and press **Save**."])
    if not yes_no("\nSend this bundle with your entry? Type yes to send it (Enter = no: nothing is sent, and the file stays saved): ", False):
        say("")
        note("warn", "Not sent: nothing has left this computer.")
        by_hand()
        return

    step(2, "Your code on GitHub")
    repo, commit = git_up()
    ok(f"{repo} at {commit[:7]}")
    step(3, "Your live site")
    site = deploy(commit)
    r = api("entry", repo_url=repo, site_url=site, commit_sha=commit)
    if r.get("error"):
        entry_refused(r["error"])
    ok(f"{site}: it opens for visitors.")

    step(4, "Sending your bundle")
    if made.get("head") != commit:
        # A last commit since the bundle was saved: the bundle is made again with the same sessions, so its history matches.
        say("   There's a new commit since the bundle was saved, so it's made again with the same sessions:")
        again = make_bundle(made.get("sessions") or None)
        if again:
            made = again
            BUNDLE = made["file"]
    r = run([node(), collector(), "upload", "-", BUNDLE, "--from-submit-py", "--server", SERVER], capture=False, timeout=900, env=with_token())
    if r.returncode != 0:
        stop("The bundle didn't upload (the reason is just above).", ONLINE)
    after = api("status")
    if after.get("upload") != "received":
        stop("The bundle was sent, but the site hasn't got it yet.", ["Wait a minute."])
    ok("Your bundle has arrived.")

    step(5, "Submit")
    say("   **After you submit, nothing more can change:** not the repo, the site or the bundle.")
    if not yes_no("   Submit your entry now? Type yes (Enter = no): ", False):
        say("")
        note("warn", "Not submitted. Run submit.py again when you're ready, or press **Submit my entry** on the hackathon page.")
        return
    r = api("submit")
    if r.get("error"):
        site_said("Submit didn't go through", r["error"])
    block([f"{mark('party')} **Submitted. Thank you!** Our team reviews it next; you can see it on the hackathon page."])


def load():
    global CONFIG, SERVER, ENV
    try:
        with open(os.path.join(HERE, ".hwa", "config.json"), encoding="utf-8") as f:
            CONFIG = json.load(f)
    except (OSError, ValueError):
        stop("This isn't your hackathon project folder: there's no .hwa/config.json here.", ["Run submit.py in your project folder: the folder init.py is in (init.py put submit.py there).", "Or run init.py again in its folder: it puts submit.py back."], again=False)
    SERVER = CONFIG.get("server") or SERVER
    if not trusted(SERVER + "/"):
        stop("This folder's hackathon site address (in .hwa/config.json) isn't a secure (https) one, so nothing was sent.", ["Run init.py again in this folder: it writes the address again and keeps everything else."], again=False)
    ENV = dict(os.environ, NO_COLOR="1", PWD=HERE, GIT_TERMINAL_PROMPT="0")
    if CONFIG.get("path"):
        ENV["PATH"] = CONFIG["path"] + os.pathsep + os.environ.get("PATH", "")


def unexpected(e):
    """Never a wall of Python: the details go to a file, and the person gets one line and what to do."""
    import traceback

    where = os.path.join(HERE, ".hwa", "submit-error.txt")
    try:
        with open(where, "w", encoding="utf-8") as f:
            f.write(f"submit.py {VERSION}\n\n{traceback.format_exc()}")
    except OSError:
        where = None
    stop(f"Something unexpected went wrong ({type(e).__name__}: {str(e)[:200]}).", [f"If it happens again, email us the file {where} (it holds no keys)."] if where else [])


if __name__ == "__main__":
    look()
    logo("submit", f"submit.py {VERSION}")
    try:
        load()
        main()
    except KeyboardInterrupt:
        settle()
        say("")
        say("Stopped. Nothing was submitted; run submit.py again any time." + (f" Your bundle is saved: {BUNDLE}" if BUNDLE else ""))
        sys.exit(130)
    except Exception as e:
        unexpected(e)
