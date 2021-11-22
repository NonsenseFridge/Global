<?php
header('Content-Type: text/html; charset=utf-8');
$src = file_get_contents("./index.html");
$gameId = isset($_GET["partner"]) ? $_GET["partner"] : null;
$jsonFileName = __DIR__."/assets/$gameId.json";
$post = json_encode((object) $_POST);

function dd(...$params)
{
    var_dump($params);
    die();
}


function denyAccess()
{
    http_response_code(403);
    die("Access to the game was denied! <br> You don't have the user rights to view this page.");
}

function getMeta($elements, $propertyName)
{
    foreach ($elements as $element) {
        /** @var DOMElement $element */
        $property = $element->attributes->getNamedItem("name");
        if ($property instanceof DOMAttr) {
            if ($property->value == $propertyName) {
                return $element;
            }
        }
        $property = $element->attributes->getNamedItem("property");
        if ($property instanceof DOMAttr) {
            if ($property->value == $propertyName) {
                return $element;
            }
        }
    }
    return null;
}

function updateMeta($elements, $propertyName, $value)
{
    $element = getMeta($elements, $propertyName);
    if ($element) {
        $element->attributes->getNamedItem("content")->value = $value;
    }
}


function getContent($json, ...$keys)
{
    $value = $json;
    foreach ($keys as $key) {
        if (!isset($value->$key)) {
            return null;
        }
        $value = $value->$key;
    }
    return $value;
}

function addOriginPolicy($origins)
{
    if (!is_null($origins)) {
        if (is_array($origins)) {
            $origins = implode(" ", $origins);
        }
        header("Content-Security-Policy: frame-ancestors $origins");
    }
    return true;
}

function getCookie($key)
{
    return isset($_COOKIE[$key]) ? $_COOKIE[$key] : null;
}

function getSession($key)
{
    session_start();
    return isset($_SESSION[$key]) ? $_SESSION[$key] : null;
}

function askPassword($password, DOMDocument $doc, $title = null, $inputmode = null)
{
    $gameId = isset($_GET["partner"]) ? $_GET["partner"] : null;
    if (getSession($gameId) === md5($gameId) || getCookie($gameId) === md5($gameId)) {
        return;
    }
    if (!$title) {
        $title = "אנא הזן סיסמה";
    }
    $script = $doc->createElement("script");
    if (!$inputmode) {
        $inputmode = "text";
    }
    $script->textContent = <<<js
function askPassword() {
		Swal.fire({
			title: '$title',
			input: "password" ,
			inputPlaceholder: 'אנא הזן סיסמה',
			allowOutsideClick: false,
			inputAttributes: {
				maxlength: 10,
				autocapitalize: 'off',
				autocorrect: 'off',
				inputmode:'$inputmode'
			},
			showLoaderOnConfirm: true,
            preConfirm: (password) => {
				let data = new FormData();
				data.append("password",password)
				data.append("partner","$gameId");
                return fetch("password.php",{
                	method:"POST",
                	body:data
                }).then(response => {
                    if (!response.ok) {
                        throw new Error("סיסמא לא נכונה")
                    }
                    location.reload();
                    return true;
      })
      .catch((error) => {
        Swal.showValidationMessage(
          error
        )
      })
  },
		});
	}

	askPassword();

js;

    $body = $doc->getElementsByTagName("body")->item(0);
    /** @var DOMNodeList $scripts */
//    $scripts = $doc->getElementsByTagName("script");
    $initGame = $doc->getElementById("init_game");
    $initGame->parentNode->removeChild($initGame);
//    for ($i = 0; $i < $scripts->count(); $i++) {
//        $currentScript = $scripts->item($i);
//        if (!$currentScript->hasAttributes()) {
//            $currentScript->parentNode->removeChild($currentScript);
//        }
//    }
//    exit();
    while ($body->hasChildNodes()) {
        $body->removeChild($body->firstChild);
    }


    $body->appendChild($script);

}

$doc = new DOMDocument('1.1', "UTF - 8");
$profile = $src;
$googleAnalytics = null;
libxml_use_internal_errors(true);
$doc->loadHTML('<?xml encoding="utf - 8" ?>'.$src);

$script = $doc->createElement("script");
$script->textContent = <<<js
var postParams = $post;
js;
$doc->getElementsByTagName("head")->item(0)->insertBefore(
    $script,
    $doc->getElementsByTagName("script")->item(0));


if (file_exists($jsonFileName)) {
    $json = json_decode(file_get_contents($jsonFileName));
    $json = $json->setting;

    addOriginPolicy(getContent($json, "server", "allowOrigin"));
    $elements = $doc->getElementsByTagName('meta');
    $gameTitle = getContent($json, "meta", "title") ?? getContent($json, "gameTitle");
    $googleAnalytics = getContent($json, "server", "googleAnalytics");
    if ($gameTitle) {
        $title = $doc->getElementsByTagName('title')->item(0);
        $title->textContent = $gameTitle;
        updateMeta($elements, "og:title", $gameTitle);
        updateMeta($elements, "og:site_name", $gameTitle);
    }
    $description = getContent($json, "meta", "description") ?? getContent($json, "popup", "openPopup", "label", "text");
    if ($description) {
        updateMeta($elements, "description", $description);
        updateMeta($elements, "og:description", $description);
    }

    $shareImage = getContent($json, "meta", "image");
    if ($shareImage) {
        updateMeta($elements, "og:image", $shareImage);
        $linkElements = $doc->getElementsByTagName('link');
        foreach ($linkElements as $element) {
            /** @var DOMElement $element */
            $property = $element->attributes->getNamedItem("rel");
            if ($property instanceof DOMAttr) {
                if ($property->value == "image_src") {
                    $element->attributes->getNamedItem("href")->value = $shareImage;
                }
            }
        }

    }

    $keywords = getContent($json, "meta", "keywords");
    if ($keywords) {
        $keywordElement = getMeta($elements, "keywords");
        if ($keywordElement) {
            $keywordElement->attributes->getNamedItem("content")->value .= ",$keywords";
        }
    }

    $actualLink = "https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    if ($actualLink) {
        updateMeta($elements, "og:url", $actualLink);
    }

    $password = getContent($json, "auth", "password");
    if ($password) {
        askPassword($password, $doc, getContent($json, "auth", "title"), getContent($json, "auth", "type"));
    }

}
$html = $doc->saveHTML($doc->documentElement);
if ($googleAnalytics) {
    $html = str_replace("UA-82479204-1", $googleAnalytics, $html);
}
if ($gameId == 'view-en') {
    echo $html;
}else{
    echo $html;
    
}
