// Default (built-in) image for each Site Editor image slot.
// These are the images currently hardcoded on the live church site.
// The portal shows these as the preview when a slot is empty, so admins
// can SEE the current image and the option to replace it — while the
// database stays empty ("empty = the site shows its original image").
//
// Site-relative images are resolved against the live site origin so they
// render inside the portal (a different app on a different URL).

const SITE_ORIGIN = 'https://icgg.us';

const raw: Record<string, string> = {
  hero_slide_1: '/1.jpg',
  hero_slide_2: 'https://www.dropbox.com/scl/fi/nx2yvtadqibyn0ui7ldn1/ICGG-23-of-133.jpg?rlkey=lqvr296qej8eqvqyepl9u77lr&st=y6g398tu&raw=1',
  hero_slide_3: 'https://www.dropbox.com/scl/fi/gbb3lkzcqrn7pwz424ryo/ICCG-11-19-53-of-135.jpg?rlkey=5mr4eaq0w91l9odc1cwt5trpy&st=45emqolf&raw=1',
  hero_slide_4: '/2.jpg',
  hero_slide_5: '/3.jpg',
  about_image: '/nuestra-mision.jpg',
  newcomers_greeter: '/greeter.png',
  newcomers_worship: '/nora.JPG',
  newcomers_community: '/Community_outreach_in_action_with_joy.png',
  pastora_photo: '/pastora-irene.jpg',
  give_hero: 'https://www.dropbox.com/scl/fi/9sfdwhicc1we24xub0f3n/give.jpg?rlkey=vlv5z2fsol4ajbzysupwpb4rr&st=nqugvu5u&raw=1',
  give_protemplo: 'https://www.dropbox.com/scl/fi/1eoami6nn96x93ejupjwd/protemplo.png?rlkey=dhnpa25v98d714y4cp8a3nzfu&st=3rhrssqi&raw=1',
  give_zelle_logo: 'https://www.dropbox.com/scl/fi/m95hkitnjv4u5cgpma5yz/zelle-logo.png?rlkey=hfa68efnvgbmbpk63d0y1jbyn&st=bmcnu326&raw=1',
  give_zelle_qr: 'https://www.dropbox.com/scl/fi/tuab5djq5t8o8a4zm9omp/zelle-tithe.jpg?rlkey=04l3myk422oc3p74grs0prork&st=n79cuejg&raw=1',
  give_tithely_logo: 'https://www.dropbox.com/scl/fi/ghtux1ngjbwseush1spvq/tithely-logo.png?rlkey=07kvgu4taglfuv4gmqn4pyaph&st=pwm5jddu&raw=1',
};

export function defaultImageFor(key: string): string {
  const v = raw[key];
  if (!v) return '';
  return v.startsWith('/') ? SITE_ORIGIN + v : v;
}
