/**
 * Authored city linework: irregular block outlines, arterials, one
 * diagonal avenue and a river cut — the same grammar as MapThumb, so
 * the world is continuous. Mounted once behind the page, fading out
 * below the fold (see .city-grid in globals.css).
 */
export function CityGrid() {
  return (
    <svg
      className="city-grid"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {/* arterials */}
        <path d="M0 172h1440" />
        <path d="M0 418h1440" />
        <path d="M0 664h1440" />
        <path d="M238 0v900" />
        <path d="M726 0v900" />
        <path d="M1174 0v900" />
        {/* diagonal avenue */}
        <path d="M-40 40 L1480 780" />
        {/* river cut */}
        <path d="M900 0c-60 120 40 180 -20 300s60 220 -10 340c-50 90 30 180 -30 260" />
        {/* блоки — северо-запад */}
        <path d="M42 38h118v72H42z" />
        <path d="M196 30h84v104h-84z" />
        <path d="M318 52h132v58H318z" />
        <path d="M488 26h96v88h-96z" />
        <path d="M622 60h74v66h-74z" />
        <path d="M46 142h86v92H46z" />
        <path d="M168 148h122v48H168z" />
        <path d="M330 132h76v110h-76z" />
        <path d="M444 150h140v60H444z" />
        <path d="M618 146h64v96h-64z" />
        {/* блоки — северо-восток */}
        <path d="M772 44h108v76H772z" />
        <path d="M918 36h64v58h-64z" />
        <path d="M1016 58h140v52h-140z" />
        <path d="M1196 30h96v92h-96z" />
        <path d="M1330 66h78v70h-78z" />
        <path d="M760 152h84v84h-84z" />
        <path d="M886 140h118v54H886z" />
        <path d="M1042 148h84v96h-84z" />
        <path d="M1168 158h130v46h-130z" />
        <path d="M1336 156h72v100h-72z" />
        {/* средний пояс */}
        <path d="M60 262h132v80H60z" />
        <path d="M232 274h74v118h-74z" />
        <path d="M348 258h108v66H348z" />
        <path d="M494 288h84v92h-84z" />
        <path d="M614 262h78v72h-78z" />
        <path d="M768 276h96v104h-96z" />
        <path d="M902 262h140v58H902z" />
        <path d="M1078 284h64v96h-64z" />
        <path d="M1180 268h112v76h-112z" />
        <path d="M1326 288h82v66h-82z" />
        <path d="M52 372h96v34H52z" />
        <path d="M186 380h132v26H186z" />
        <path d="M366 356h72v52h-72z" />
        <path d="M478 372h116v34H478z" />
        <path d="M636 366h56v42h-56z" />
        {/* южный пояс */}
        <path d="M64 448h108v96H64z" />
        <path d="M214 460h84v58h-84z" />
        <path d="M336 442h128v82H336z" />
        <path d="M506 466h72v104h-72z" />
        <path d="M614 452h92v64h-92z" />
        <path d="M770 448h74v112h-74z" />
        <path d="M880 470h134v54H880z" />
        <path d="M1056 444h86v88h-86z" />
        <path d="M1188 458h120v62h-120z" />
        <path d="M1344 448h64v104h-64z" />
        <path d="M58 574h140v58H58z" />
        <path d="M240 566h68v92h-68z" />
        <path d="M348 588h112v44H348z" />
        <path d="M502 570h88v72h-88z" />
        <path d="M628 584h64v48h-64z" />
        <path d="M756 576h104v66H756z" />
        <path d="M896 590h78v52h-78z" />
        <path d="M1014 570h128v58h-128z" />
        <path d="M1186 582h84v76h-84z" />
        <path d="M1310 574h98v52h-98z" />
        {/* нижняя кромка, уходит в туман */}
        <path d="M70 692h96v78H70z" />
        <path d="M204 704h124v52H204z" />
        <path d="M372 686h80v96h-80z" />
        <path d="M494 712h104v46H494z" />
        <path d="M642 690h58v72h-58z" />
        <path d="M760 706h92v64h-92z" />
        <path d="M892 688h130v54H892z" />
        <path d="M1064 710h72v84h-72z" />
        <path d="M1174 692h110v58h-110z" />
        <path d="M1324 704h84v72h-84z" />
      </g>
    </svg>
  );
}
