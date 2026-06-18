// ============================================================
// i18n.js — TR / EN Internationalization Engine
// ============================================================
(function () {
  'use strict';

  // ----------------------------------------------------------
  // TRANSLATIONS
  // ----------------------------------------------------------
  const TRANSLATIONS = {
    tr: {
      page_title: 'AYBÜ Akademik Ödül Sistemi',
      skip_to_content: 'Ana içeriğe atla',
      header_logo_aria: 'AYBÜ Akademik Ödül Sistemi',
      header_brand_pre: 'AYBÜ',
      header_brand_bold: 'Akademik Ödül Sistemi',
      btn_menu_aria: 'Menü',
      nav_user_menu_aria: 'Kullanıcı menüsü',
      btn_change_password: 'Şifre Değiştir',
      btn_change_password_aria: 'Şifre değiştir',
      btn_logout: 'Çıkış Yap',
      btn_logout_aria: 'Oturumu kapat',

      login_university_name: 'Ankara Yıldırım Beyazıt Üniversitesi',
      login_system_name: 'Akademik Ödül Sistemi',
      label_email: 'E-posta',
      placeholder_email: 'E-posta adresinizi girin',
      label_password: 'Şifre',
      placeholder_password: 'Şifrenizi girin',
      btn_toggle_password_aria: 'Şifreyi göster veya gizle',
      btn_login: 'Giriş Yap',
      btn_register_link: 'Kayıt olun',
      login_register_note: 'İlk defa giriş yapıyorsanız kayıt olun',
      login_help_link: 'Giriş sorunu mu yaşıyorsunuz?',
      login_footer: 'AÖS v1.0.0 © 2026 Ankara Yıldırım Beyazıt Üniversitesi',

      register_heading: 'Ankara Yıldırım Beyazıt Üniversitesi',
      register_subtitle: 'Akademik Ödül Sistemi Kayıt Formu',
      label_firstname: 'Ad',
      placeholder_firstname: 'Adınız',
      label_lastname: 'Soyad',
      placeholder_lastname: 'Soyadınız',
      label_title: 'Unvan',
      placeholder_title_select: 'Unvan seçin',
      title_prof_dr: 'Prof. Dr.',
      title_doc_dr: 'Doç. Dr.',
      title_dr_ogr_uyesi: 'Dr. Öğr. Üyesi',
      title_ogr_gor_dr: 'Öğr. Gör. Dr.',
      title_ogr_gor: 'Öğr. Gör.',
      title_ars_gor_dr: 'Arş. Gör. Dr.',
      title_ars_gor: 'Arş. Gör.',
      label_email_note: 'Sadece @aybu.edu.tr uzantılı e-posta adresleri kabul edilir.',
      label_reg_password: 'Şifre',
      placeholder_reg_password: 'En az 6 karakter',
      label_reg_password_confirm: 'Şifre (Tekrar)',
      placeholder_reg_password_confirm: 'Şifreyi tekrar girin',
      label_faculty: 'Fakülte / Birim',
      placeholder_faculty_select: 'Fakülte seçin',
      label_dept: 'Bölüm',
      placeholder_dept_select: 'Seçiniz',
      btn_register: 'Kayıt Ol',
      link_go_login: 'Zaten hesabınız var mı? Giriş yapın',

      verify_heading: 'E-posta Doğrulama',
      verify_subtitle: 'Kayıt e-postanıza gönderdiğimiz 6 haneli kodu girin.',
      label_verify_code: 'Doğrulama Kodu',
      placeholder_verify_code: '123456',
      btn_verify: 'Doğrula ve Kaydı Tamamla',
      link_resend_code: 'Kodu yeniden gönder',
      link_back_to_register: 'Kayıt formuna geri dön',

      sidebar_toggle_aria: 'Sidebar aç/kapat',
      profile_loading: 'Yükleniyor...',
      sidebar_panel_aria: 'Panel menüsü',
      btn_sidebar_dashboard: 'Genel Bakış',
      btn_sidebar_new_app: 'Yeni Başvuru Oluştur',
      btn_sidebar_my_apps: 'Başvurularım',

      guide_card_heading: 'Hesaplama Rehberi ve Uygulama Esasları',
      guide_table_caption: 'Hesaplama rehberi ve uygulama esasları tablosu',
      guide_col_topic: 'Konu',
      guide_col_description: 'Açıklama',

      my_apps_heading: 'Başvurularım',
      my_apps_desc: 'Akademik ödül başvuru geçmişiniz ve güncel durumunuz.',
      btn_back_to_panel: 'Panele Dön',
      my_apps_table_caption: 'Akademisyen başvuru geçmişi tablosu',
      th_app_year: 'Başvuru Yılı',
      th_app_category: 'Başvurulan Kategori',
      th_calculated_score: 'Hesaplanan Puan',
      th_approved_score: 'Onaylanan Puan',
      th_last_update: 'Son Güncelleme',
      th_status: 'Durum',
      th_actions: 'İşlemler',
      no_applications_msg: 'Henüz bir başvurunuz bulunmamaktadır. Puanınızı hesaplamak ve başvuru yapmak için "Yeni Başvuru Oluştur" butonunu kullanabilirsiniz.',
      mobile_nav_aria: 'Hızlı erişim',
      btn_mobile_new_app: 'Yeni Başvuru',
      btn_mobile_my_apps: 'Başvurularım',

      btn_back_to_dashboard: 'Panele Dön',
      app_form_title_new: 'Yeni Akademik Ödül Başvurusu',
      app_form_title_edit: 'Başvuruyu Düzenle',
      revision_note_heading: 'Revizyon Notu',
      revision_note_default: 'Komisyon tarafından revizyon istendi. Lütfen başvurunuzu açıklamalara göre güncelleyin.',
      step_nav_aria: 'Başvuru adımları',
      step1_label: 'Genel Bilgiler',
      step2_label: 'Faaliyet Veri Girişi',
      step3_label: 'Kanıt Belgeleri & Onay',

      step1_card_heading: 'Aday ve Kategori Bilgileri',
      label_app_year: 'Başvuru Yılı',
      help_app_year: 'Başvuru yapmak istediğiniz akademik yılı seçin.',
      label_app_category: 'Başvurulan Kategori',
      placeholder_app_category: 'Lütfen başvuru kategorinizi seçin',
      cat1_option: 'Kategori 1: Araştırma, Yayın, Etkinlik ve Yenilikçi Tasarım',
      cat2_option: 'Kategori 2: Proje (Tamamlanmış)',
      cat3_option: 'Kategori 3: Patent ve Faydalı Model',
      cat4_option: 'Kategori 4: Akademik Danışmanlık, Eğitim ve Kurumsal Katkı',
      help_app_category: 'Her başvuru sahibi yalnızca bir kategori seçebilir.',
      alert_one_category_rule: 'Önemli Kural: Her başvuru sahibi yalnızca bir kategoriden başvuru yapabilir. Puanlama tablosundaki hesaplamalar sadece seçtiğiniz bu kategori için geçerli olacaktır.',
      category_info_heading: 'Seçtiğiniz Kategoriye Ait Bilgilendirme',
      category_info_subtext: 'Devam etmeden önce kategorinize ait aşağıdaki hususları okuyunuz.',
      category_info_ack_label: 'Yukarıdaki bilgilendirmeyi okudum ve anladım.',
      avesis_ack_label: 'AVESİS profilimde yer alan tüm akademik faaliyet bilgilerimin eksiksiz ve güncel olduğunu beyan ederim.',
      btn_step1_next: 'Sonraki Adım',
      btn_step1_next_tooltip_no_cat: 'Kategori seçmelisiniz',
      btn_step1_next_tooltip_no_ack: 'Kategori bilgilendirmesini onaylamalısınız',
      btn_step1_next_tooltip_no_avesis: 'AVESİS beyanını onaylamalısınız',
      btn_step1_next_tooltip_ok: 'Sonraki Adıma Git',

      calc_header_title: 'Kategori Puanlama Tablosu',
      calc_header_hint: 'Pembe alanları doldurunuz. Mavi alanlar otomatik hesaplanır.',
      calc_total_label: 'TOPLAM PUAN',
      calc_table_caption: 'Akademik faaliyet puanlama tablosu.',
      th_activity_type: 'Faaliyet Türü (Kapsam)',
      th_base_score: 'Taban Puan',
      th_max_score: 'Maks Puan',
      th_value: 'Değer',
      th_ratio: 'Katkı Oranı (0.01-1.00)',
      th_ratio_help_aria: 'Katkı oranı hesaplama tablosunu göster',
      th_ratio_help_title: 'Katkı oranını nasıl hesaplarım?',
      th_total_score: 'Toplam Puan',
      calc_grand_total_label: 'KATEGORİ TOPLAM PUANI:',
      max_text_no_limit: 'Limit Yok',
      btn_step2_prev: 'Önceki Adım',
      btn_step2_next: 'Sonraki Adım (Belgeler)',

      step3_heading: 'Başvuru Kanıtlayıcı Belgeleri',
      tesvik_question_label: '2025 yılında Akademik Teşvik Ödeneği başvurusu yaptınız mı?',
      tesvik_yes: 'Evet',
      tesvik_no: 'Hayır',
      evidence_section_heading: 'Kanıt Belgeleri',
      tesvik_checklist_intro: 'Aşağıdaki faaliyetlerden Akademik Teşvik başvurusunda kanıt ibraz etmediğiniz kalemleri işaretleyiniz:',
      evidence_no_activities_msg: 'Herhangi bir faaliyet verisi girmediniz. Lütfen geri dönüp puan alacağınız faaliyetleri doldurunuz.',
      evidence_all_covered_msg: 'Kanıt yüklemeniz gereken faaliyet bulunmuyor. Başvuruyu gönderebilirsiniz.',
      evidence_help_text_no: 'Akademik Teşvik başvurusu yapmadığınız için girdiğiniz tüm faaliyetlerin kanıt belgesini yüklemeniz gerekmektedir.',
      evidence_help_text_yes: 'Akademik Teşvik başvurusunda kanıt ibraz etmediğiniz faaliyetleri işaretleyiniz.',
      btn_upload_file: 'Dosya Yükle',
      upload_status_pending: 'Yüklenmedi (PDF/Görsel)',
      btn_remove_file_aria: 'Dosyayı kaldır',
      aria_ratio_input: '{label} katkı oranı, 0.01 ile 1.00 arasında',
      aria_month_input: '{label} ay sayısı',
      aria_count_input: '{label} {unit} değeri',
      unit_research: 'araştırma',
      unit_item: 'adet',
      unit_month: 'ay',
      upload_evidence_aria: '{label} kanıt yükle',
      evidence_doc_singular: 'Kanıt Belgesi',
      appeal_badge: 'İTİRAZ',
      btn_step3_prev: 'Önceki Adım',
      btn_save_draft: 'Taslak Olarak Kaydet',
      btn_submit_application: 'Başvuruyu Gönder',
      btn_submit_title_no_tesvik: 'Lütfen Akademik Teşvik başvurusu sorusunu cevaplayınız.',
      btn_submit_title_missing_evidence: 'Kanıt yüklemeniz gereken tüm faaliyetler için dosya yükleyiniz.',
      btn_submit_title_ready: 'Başvuruyu gönder',

      stat_total_apps_label: 'Toplam Başvuru',
      stat_pending_apps_label: 'Değerlendirme Bekleyen',
      stat_approved_apps_label: 'Onaylanan Başvuru',
      stat_rejected_apps_label: 'Reddedilen Başvuru',

      admin_tabs_aria: 'Yönetici panel sekmeleri',
      tab_submissions: 'Başvurular',
      tab_config: 'Puanlama Kriterleri',
      tab_users: 'Kullanıcı Yönetimi',

      admin_apps_desc: 'Yönetici panelinde tüm başvuruları listeleyin, arayın ve filtreleyin.',
      filter_aria: 'Başvuru filtreleri',
      label_admin_search: 'İsim veya e-posta ile ara',
      placeholder_admin_search: 'Lütfen isim veya e-posta ile arama yapın',
      help_admin_search: 'Akademisyen adı veya e-posta adresine göre filtreleyin.',
      label_filter_status: 'Durum Filtresi',
      filter_status_all: 'Tüm durumları göster',
      filter_status_draft: 'Taslak',
      filter_status_submitted: 'İncelenmeyi bekleyen',
      filter_status_approved: 'Onaylandı',
      filter_status_rejected: 'Reddedildi',
      filter_status_revision: 'Revizyon istendi',
      filter_status_in_review: 'İtiraz / İncelemede',
      help_filter_status: 'Başvuru durumuna göre listeyi filtreleyin.',
      label_filter_faculty: 'Fakülte Filtresi',
      filter_faculty_all: 'Tüm fakülteleri göster',
      help_filter_faculty: 'Fakülteye göre başvuruları filtreleyin.',
      admin_table_caption: 'Yönetici başvuru listesi',
      th_academician: 'Akademisyen',
      th_faculty_dept: 'Fakülte / Bölüm',
      th_year: 'Başvuru Yılı',
      th_category: 'Kategori',
      no_results_msg: 'Arama kriterlerine uygun başvuru bulunamadı.',

      config_heading: 'Puanlama Kriterleri ve Limitleri',
      config_desc: 'Aşağıdan kategorileri seçip taban puanları ve maksimum puan limitlerini canlı olarak güncelleyebilirsiniz.',
      label_config_category: 'Puanlama Kategorisi',
      config_cat1_option: 'Kategori 1: Araştırma, Yayın, Etkinlik',
      config_cat2_option: 'Kategori 2: Proje (Tamamlanmış)',
      config_cat3_option: 'Kategori 3: Patent ve Faydalı Model',
      config_cat4_option: 'Kategori 4: Akademik Danışmanlık ve Eğitim',
      config_table_caption: 'Puanlama kriterleri yapılandırma tablosu',
      th_config_activity: 'Faaliyet Türü',
      th_config_base: 'Taban Puan',
      th_config_max: 'Maks Puan Sınırı (0 = Limit Yok)',
      btn_save_config: 'Yapılandırmayı Kaydet',

      users_heading: 'Kullanıcı & Hesap Yönetimi',
      users_desc: 'Tüm akademisyen ve komisyon hesaplarını buradan ekleyebilir, düzenleyebilir, şifre sıfırlayabilir veya silebilirsiniz.',
      btn_add_user: 'Yeni Kullanıcı Ekle',
      stat_total_users_label: 'Toplam Hesap',
      stat_academic_users_label: 'Akademisyen',
      stat_faculty_admins_label: 'Komisyon Yöneticisi',
      stat_all_applications_label: 'Toplam Başvuru',
      users_filter_aria: 'Kullanıcı filtreleri',
      label_users_search: 'Kullanıcı ara',
      placeholder_users_search: 'İsim, e-posta veya kullanıcı adı ile ara',
      label_users_filter_role: 'Hesap Türü',
      filter_role_all: 'Tüm hesaplar',
      filter_role_academic: 'Akademisyen',
      filter_role_faculty_admin: 'Fakülte Komisyonu',
      filter_role_system_admin: 'Sistem Yöneticisi',
      label_users_filter_faculty: 'Fakülte',
      filter_users_faculty_all: 'Tüm fakülteler',
      users_table_caption: 'Sistem kullanıcı listesi',
      th_full_name: 'Ad Soyad',
      th_login_info: 'Giriş Bilgisi',
      th_account_type: 'Hesap Türü',
      th_faculty_unit: 'Fakülte / Birim',
      th_application_count: 'Başvuru',
      no_users_msg: 'Arama kriterlerine uygun kullanıcı bulunamadı.',

      btn_back_to_admin: 'Panele Dön',
      admin_detail_heading: 'Başvuru Değerlendirme & İnceleme',
      badge_in_review: 'İnceleniyor',
      detail_applicant_heading: 'Aday Bilgileri',
      detail_label_name: 'Adı Soyadı:',
      detail_label_title: 'Unvan / Kadro:',
      detail_label_faculty: 'Fakülte:',
      detail_label_dept: 'Bölüm:',
      detail_label_year: 'Başvuru Yılı:',
      detail_label_category: 'Kategori:',
      detail_activities_heading: 'Beyan Edilen Akademik Faaliyetler',
      detail_activities_caption: 'Başvuruda beyan edilen akademik faaliyetler ve hesaplanan puanlar',
      th_detail_activity: 'Faaliyet Türü (Kapsam)',
      th_detail_base: 'Taban Puan',
      th_detail_max: 'Maks Puan',
      th_detail_count: 'Adet',
      th_detail_ratio: 'Katkı Oranı',
      th_detail_score: 'Hesaplanan Puan',
      detail_docs_heading: 'Yüklenen Belgeler',
      detail_evidence_label: 'Kanıt Belgesi',
      btn_view_document: 'İncele',
      detail_appeal_heading: 'Akademisyen İtirazı',
      detail_appeal_reasoning_label: 'İtiraz Gerekçesi:',
      eval_decision_heading: 'Değerlendirme Kararı',
      eval_calculated_label: 'Hesaplanan Toplam Puan:',
      label_eval_notes: 'Komisyon Değerlendirme Notu',
      help_eval_notes: 'Revizyon veya red kararlarında gerekçe yazılması zorunludur.',
      label_appeal_response: 'İtiraz Cevabı',
      placeholder_appeal_response: 'Lütfen itiraza verilecek karar ve açıklamayı yazın',
      help_appeal_response: 'Akademisyenin itirazına resmi yanıtınızı yazın.',
      label_approved_score: 'Onaylanan Puan',
      placeholder_approved_score: 'Lütfen onaylanan puanı girin',
      help_approved_score: 'Komisyon tarafından onaylanan nihai puan.',
      placeholder_eval_notes: 'Lütfen revizyon, red veya onay gerekçenizi detaylıca yazın',
      btn_approve: 'Başvuruyu Onayla',
      btn_request_revision: 'Revizyon İste',
      btn_reject: 'Başvuruyu Reddet',

      modal_add_user_title: 'Kullanıcı Ekle',
      modal_close_aria: 'Pencereyi kapat',
      label_user_role: 'Hesap Türü',
      option_role_academic: 'Akademisyen',
      option_role_faculty_admin: 'Fakülte Komisyon Yöneticisi',
      label_user_email: 'E-posta',
      placeholder_user_email: 'ornek@aybu.edu.tr',
      label_username: 'Kullanıcı Adı',
      placeholder_username: 'kullanici.adi',
      label_user_name: 'Ad Soyad',
      placeholder_user_name: 'Ad Soyad',
      label_user_title: 'Unvan',
      title_komisyon: 'Komisyon',
      label_user_password: 'Şifre',
      placeholder_user_password: 'En az 6 karakter',
      label_user_faculty: 'Fakülte / Birim',
      label_user_dept: 'Bölüm',
      placeholder_user_dept_first: 'Önce fakülte seçin',
      btn_cancel: 'İptal',
      btn_save: 'Kaydet',
      modal_edit_user_title: 'Kullanıcı Düzenle',
      modal_new_user_title: 'Yeni Kullanıcı Ekle',

      modal_reset_password_title: 'Şifre Sıfırla',
      label_reset_new_password: 'Yeni Şifre',
      placeholder_reset_new_password: 'En az 6 karakter',
      label_reset_confirm_password: 'Yeni Şifre (Tekrar)',
      placeholder_reset_confirm_password: 'Yeni şifreyi tekrar girin',
      btn_update_password: 'Şifreyi Güncelle',

      modal_change_password_title: 'Şifre Değiştir',
      label_current_password: 'Mevcut Şifre',
      placeholder_current_password: 'Mevcut şifreniz',
      label_new_password: 'Yeni Şifre',
      placeholder_new_password: 'En az 6 karakter',
      label_confirm_password: 'Yeni Şifre (Tekrar)',
      placeholder_confirm_password: 'Yeni şifrenizi tekrar girin',

      modal_appeal_title: 'Başvuru Sonucuna İtiraz Et',
      modal_appeal_close_aria: 'İtiraz penceresini kapat',
      modal_appeal_desc: 'Komisyonun kararını ve notunu inceleyiniz. İtiraz etmek istiyorsanız, lütfen geçerli akademik gerekçelerinizi ve varsa ek açıklamalarınızı yazınız.',
      appeal_admin_notes_label: 'Komisyon Notu',
      label_appeal_reasoning: 'İtiraz Gerekçeniz',
      label_appeal_reasoning_required: '(zorunlu)',
      placeholder_appeal_reasoning: 'Lütfen itiraz gerekçenizi detaylı olarak yazın',
      help_appeal_reasoning: 'İtirazınızı destekleyen akademik gerekçeleri açık ve net biçimde yazın.',
      label_appeal_attachment: 'Ek Belge',
      appeal_attachment_optional: '(isteğe bağlı)',
      appeal_file_placeholder: 'Belge eklemek için tıklayın',
      appeal_file_size_hint: 'PDF veya görsel (maks. 10 MB)',
      btn_remove_appeal_file_aria: 'Eklenen belgeyi kaldır',
      appeal_file_input_aria: 'İtiraz belgesi seç',
      btn_cancel_appeal: 'Kapat',
      btn_submit_appeal: 'İtirazı Gönder',

      katki_modal_title: 'Ortak Çalışmalar İçin Katkı Oranı Tablosu',
      katki_modal_close_aria: 'Kapat',
      katki_modal_intro: 'Aşağıdaki tablo, Akademik Yükseltilme ve Atanma Kriterleri Yönergesi Tablo 2\'den alınmıştır. İsim sıranıza ve çalışmadaki toplam yazar sayısına göre katkı oranınızı bulunuz.',
      katki_table_col_order: 'İsim Sırası',
      katki_table_col_authors: 'Ortak Çalışmadaki Yazar Sayısı',
      katki_author_1: '1. Yazar',
      katki_author_2: '2. Yazar',
      katki_author_3: '3. Yazar',
      katki_author_4: '4. Yazar',
      katki_author_5: '5. Yazar',
      katki_author_6: '6. Yazar',
      katki_author_7plus: '7. ve sonrası',
      katki_modal_footnote: '* Hesaplanan değer tam sayı çıkmazsa standart yuvarlama uygulanır. Sisteme oranı ondalık olarak giriniz (örn. %90 → 0.90).',

      arastirma_modal_title: 'Araştırma Faaliyeti — Ay Girişi Hakkında',
      arastirma_modal_close_aria: 'Kapat',
      arastirma_modal_intro: 'Araştırma faaliyetleri, Taban Puan × Ay formülüyle puanlanır. Farklı sürelerde birden fazla araştırma yürüttüyseniz her birini ayrı satırda girebilirsiniz.',
      arastirma_modal_example_label: 'Örnek:',
      arastirma_modal_example: 'Yurt içinde 3 ayrı araştırma yürüttünüz — biri 4 ay, biri 6 ay, biri 8 ay.',
      arastirma_modal_example_detail: '→ İlk kutuya 4 yazın, + butonuna basın, 6 yazın, tekrar + basın, 8 yazın. Sistem toplam 18 ay olarak hesaplar.',
      arastirma_modal_rule: 'Araştırmanın üniversite yönetim kurulunun izin kararıyla, en az 1 ay süreyle araştırmacının kadrosunun bulunduğu kurum dışında yürütülmüş olması gerekir.',
      arastirma_modal_li1: 'Yurt dışı araştırmalar en fazla 12 ay (maks. 120 puan) puanlandırılır.',
      arastirma_modal_li2: 'Yurt içi araştırmalar en fazla 12 ay (maks. 60 puan) puanlandırılır.',
      arastirma_modal_li3: 'Katkı oranı yalnızca ortak yürütücülük durumunda geçerlidir.',
      arastirma_modal_source: 'Kaynak: Akademik Teşvik Ödeneği 2025 Faaliyet Yılı Uygulama Usul ve İlkeleri',
      btn_add_month_aria: 'Yeni araştırma satırı ekle',
      btn_add_month_title: 'Araştırma ekle',
      btn_remove_month_aria: 'Bu satırı kaldır',

      idle_modal_title: 'Oturum Zaman Aşımı Uyarısı',
      idle_modal_desc: 'Bir süredir işlem yapılmadığı için oturumunuz kapatılmak üzere.',
      idle_countdown_text: 'saniye',
      idle_continue_question: 'Devam etmek istiyor musunuz?',
      idle_countdown_label: 'Oturumunuz {n} saniye içinde otomatik olarak kapatılacak.',
      btn_idle_logout: 'Oturumu Kapat',
      btn_idle_stay: 'Devam Et',

      footer_text: '© 2026 Ankara Yıldırım Beyazıt Üniversitesi. AYBÜ Akademik Ödül Sistemi Web Portalı. Tüm Hakları Saklıdır.',
      toast_close_aria: 'Bildirimi kapat',
      toast_welcome: 'Hoş geldiniz, {title} {name}!',
      toast_logout: 'Oturum kapatıldı.',
      toast_idle_logout: 'Hareketsizlik nedeniyle oturum otomatik kapatıldı.',
      toast_reg_success: 'Kayıt başarılı! Lütfen giriş yapın.',
      toast_verification_sent: 'Doğrulama kodu e-posta adresinize gönderildi.',
      toast_verification_resent: 'Doğrulama kodu yeniden gönderildi.',
      toast_evidence_uploaded: 'Kanıt dosyası başarıyla yüklendi.',

      error_email_required: 'E-posta adresi veya yönetici kullanıcı adı girin.',
      error_invalid_email: 'Geçerli bir e-posta adresi girin.',
      error_password_required: 'Şifre girin.',
      error_form_invalid: 'Lütfen kayıt formundaki tüm alanları doğru şekilde doldurun.',
      error_password_too_short: 'Şifre en az 6 karakter olmalıdır.',
      error_passwords_mismatch: 'Girdiğiniz şifreler eşleşmiyor. Lütfen aynı şifreyi iki kutuya da girin.',
      error_email_domain: 'Kayıt yalnızca @aybu.edu.tr uzantılı e-posta adresleri ile yapılabilir.',
      error_faculty_dept_required: 'Lütfen fakülte ve bölümünüzü listeden seçin.',
      error_dept_mismatch: 'Seçilen bölüm, fakülte ile eşleşmiyor. Lütfen tekrar seçin.',
      error_verify_no_email: 'Lütfen önce kayıt formunu doldurun.',
      error_new_passwords_mismatch: 'Yeni şifreler eşleşmiyor.',
      tooltip_select_category: 'Kategori seçmelisiniz',
      tooltip_ack_category_info: 'Kategori bilgilendirmesini onaylamalısınız',
      tooltip_ack_avesis: 'AVESİS beyanını onaylamalısınız',
      tooltip_next_step: 'Sonraki Adıma Git',
      error_category_required: 'Lütfen başvuru yapacağınız kategoriyi seçiniz.',
      error_category_ack_required: 'Devam etmeden önce kategori bilgilendirmesini onaylamalısınız.',
      error_no_activity_data: 'Lütfen en az bir akademik faaliyetin adet veya saatini giriniz.',
      error_tesvik_question: 'Lütfen Akademik Teşvik başvurusu sorusunu cevaplayınız.',
      error_missing_evidence: 'Kanıt yüklemeniz gereken tüm faaliyetler için dosya yükleyiniz.',
      error_revision_required: 'Red veya Revizyon kararları için Değerlendirme Notu yazılması zorunludur.',
      error_apps_load_failed: 'Başvurular yüklenirken bir hata oluştu.',
      error_api_response: 'API yanıtı alınamadı. Sunucuyu yeniden başlatıp tekrar deneyin.',
      error_unexpected_response: 'Sunucudan beklenmeyen yanıt alındı.',
      error_api_generic: 'API Hatası oluştu.',

      confirm_delete_own_app: 'Bu başvuruyu silmek istediğinize emin misiniz? Sildikten sonra farklı kategoriden yeniden başvuru yapabilirsiniz.',
      confirm_delete_admin_app: '{name} adlı başvuruyu kalıcı olarak silmek istediğinize emin misiniz?',
      confirm_delete_user: '{name} hesabını ve ilişkili tüm başvurularını silmek istediğinize emin misiniz?',
      toast_blocked_new_app: 'Farklı kategoriden başvuru yapamazsınız. Eski başvurunuzu silip yeniden yapın.',
      new_app_blocked_title: 'Farklı kategoriden başvurmak için önce mevcut başvurunuzu silin.',

      status_submitted: 'Gönderildi',
      status_in_review: 'İnceleniyor',
      status_approved: 'Onaylandı',
      status_rejected: 'Reddedildi',
      status_revision_required: 'Revizyon Gerekli',
      status_draft: 'Taslak',
      status_review_waiting: 'İnceleme Bekliyor',
      status_appeal_review: 'İtiraz / İncelemede',
      status_revision_requested: 'Revizyon İstendi',
      status_evaluating: 'Değerlendirmede',

      btn_edit_app: 'Düzenle',
      btn_view_app: 'Görüntüle',
      btn_appeal_app: 'İtiraz Et',
      btn_delete_app: 'Sil',
      btn_evaluate_app: 'Değerlendir',
      badge_appeal_marker: 'İTİRAZ',
      btn_back_override: 'Geri Dön',

      role_system_admin: 'Sistem Yöneticisi',
      role_faculty_admin: 'Fakülte Komisyonu',
      role_academic: 'Akademisyen',
      role_commission_label: 'Komisyon',
      faculty_commission_suffix: 'Akademik Ödül Komisyonu',
      unknown_applicant: 'Bilinmeyen',
      no_reason_provided: 'Gerekçe belirtilmemiş.',
      reset_password_label: '{name} hesabı için yeni şifre belirleyin.',
      faculty_admin_banner: 'Yalnızca {faculty} başvurularını görüntülüyorsunuz.',
      admin_config_cat_select_label: 'Puanlama Kategorisi',
      config_base_aria: 'taban puanı',
      config_max_aria: 'maksimum puan sınırı',

      srv_reg_success: 'Kayıt işlemi başarıyla tamamlandı. Lütfen giriş yapın.',
      srv_reg_verified: 'E-posta doğrulandı, kayıt işlemi başarıyla tamamlandı.',
      srv_verification_sent: 'Doğrulama kodu e-posta adresinize gönderildi.',
      srv_verification_resent: 'Doğrulama kodu yeniden gönderildi.',
      srv_password_changed: 'Şifreniz başarıyla güncellendi.',
      srv_app_deleted: 'Başvurunuz silindi. Artık farklı kategoriden yeniden başvuru yapabilirsiniz.',
      srv_appeal_submitted: 'İtiraz başvurusu başarıyla yapıldı.',
      srv_admin_app_deleted: 'Başvuru başarıyla silindi.',
      srv_app_evaluated: 'Başvuru başarıyla değerlendirildi.',
      srv_user_updated: 'Kullanıcı güncellendi.',
      srv_sysadmin_updated: 'Sistem yöneticisi güncellendi.',
      srv_user_password_updated: 'Kullanıcı şifresi güncellendi.',
      srv_user_deleted: 'Kullanıcı ve ilişkili başvurular silindi.',
      srv_commission_created: 'Komisyon yönetici hesabı oluşturuldu.',
      srv_academic_created: 'Akademisyen hesabı oluşturuldu.',
      srv_config_saved: 'Kategori yapılandırması başarıyla güncellendi.',
      srv_app_draft_saved: 'Başvuru taslak olarak kaydedildi.',
      srv_app_submitted: 'Başvuru başarıyla gönderildi.',
      srv_draft_updated: 'Taslak güncellendi.',

      srv_err_no_token: 'Yetkisiz erişim: Token bulunamadı.',
      srv_err_invalid_token: 'Geçersiz veya süresi dolmuş token.',
      srv_err_admin_required: 'Bu işlem için yönetici yetkisi gereklidir.',
      srv_err_sysadmin_required: 'Bu işlem için sistem yöneticisi yetkisi gereklidir.',
      srv_err_all_fields_required: 'Tüm alanları doldurmak zorunludur.',
      srv_err_email_domain: 'Kayıt yalnızca @aybu.edu.tr uzantılı e-posta adresleri ile yapılabilir.',
      srv_err_invalid_faculty_dept: 'Geçersiz fakülte veya bölüm seçimi. Lütfen listeden seçim yapın.',
      srv_err_email_exists: 'Bu e-posta adresiyle kayıtlı bir kullanıcı zaten var.',
      srv_err_admin_only_by_sysadmin: 'Yönetici hesapları yalnızca sistem yöneticisi tarafından tanımlanabilir.',
      srv_err_verification_email_failed: 'Doğrulama e-postası gönderilemedi. Lütfen daha sonra tekrar deneyin.',
      srv_err_email_code_required: 'E-posta ve doğrulama kodu gereklidir.',
      srv_err_no_pending_reg: 'Bekleyen bir kayıt bulunamadı. Lütfen kayıt formunu yeniden doldurun.',
      srv_err_code_expired: 'Doğrulama kodunun süresi doldu. Lütfen kayıt formunu yeniden doldurun.',
      srv_err_invalid_code: 'Doğrulama kodu hatalı.',
      srv_err_email_required: 'E-posta gereklidir.',
      srv_err_credentials_required: 'Kullanıcı adı ve şifre girin.',
      srv_err_login_user_not_found_academic: 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı. Lütfen kayıt olun.',
      srv_err_login_user_not_found_admin: 'Yönetici hesabı bulunamadı. Hesap tanımlaması için lütfen artuncay@aybu.edu.tr adresine mail atın.',
      srv_err_login_wrong_password_admin: 'Şifre hatalı. Lütfen artuncay@aybu.edu.tr adresine mail atın.',
      srv_err_login_wrong_password: 'Hatalı şifre. Kayıtlı değilseniz lütfen kayıt olun.',
      srv_err_passwords_required: 'Mevcut şifre ve yeni şifre gereklidir.',
      srv_err_password_too_short: 'Şifre en az 6 karakter olmalıdır.',
      srv_err_wrong_current_password: 'Mevcut şifreniz hatalı.',
      srv_err_user_not_found: 'Kullanıcı bulunamadı.',
      srv_err_config_missing: 'Kategori yapılandırması eksik.',
      srv_err_upload_failed: 'Dosya yüklenemedi.',
      srv_err_app_not_found_or_forbidden: 'Başvuru bulunamadı veya bu başvuruya erişim yetkiniz yok.',
      srv_err_incomplete_app: 'Eksik başvuru bilgileri.',
      srv_err_duplicate_app: 'Sistemde kayıtlı bir başvurunuz zaten bulunuyor. Farklı kategoriden başvurmak için önce mevcut başvurunuzu silin.',
      srv_err_app_not_found: 'Başvuru bulunamadı.',
      srv_err_app_locked: 'Gönderilmiş ve inceleme aşamasındaki başvurular düzenlenemez.',
      srv_err_category_locked: 'Başvuru kategorisi değiştirilemez. Farklı kategori seçmek için mevcut başvuruyu silip yeniden başvurun.',
      srv_err_year_locked: 'Başvuru yılı değiştirilemez. Farklı başvuru oluşturmak için mevcut başvuruyu silin.',
      srv_err_appeal_reason_required: 'İtiraz gerekçesi yazılmalıdır.',
      srv_err_appeal_not_rejected: 'Sadece reddedilmiş başvurulara itiraz edilebilir.',
      srv_err_admin_not_found: 'Yönetici hesabı bulunamadı.',
      srv_err_sysadmin_cannot_create: 'Sistem yöneticisi hesabı bu panelden oluşturulamaz.',
      srv_err_commission_fields_required: 'Komisyon hesabı için kullanıcı adı ve fakülte gereklidir.',
      srv_err_username_taken: 'Bu kullanıcı adı zaten kullanılıyor.',
      srv_err_invalid_faculty: 'Geçersiz fakülte seçimi.',
      srv_err_faculty_admin_exists: 'Bu fakülte için zaten bir komisyon hesabı tanımlı.',
      srv_err_academic_fields_required: 'Akademisyen için tüm alanlar gereklidir.',
      srv_err_sysadmin_type_locked: 'Sistem yöneticisi hesap türü değiştirilemez.',
      srv_err_sysadmin_cannot_assign: 'Sistem yöneticisi hesabı bu panelden atanamaz.',
      srv_err_invalid_eval_status: 'Geçersiz değerlendirme durumu.',
      srv_err_eval_forbidden: 'Bu başvuruyu değerlendirme yetkiniz bulunmamaktadır.',
      srv_err_sysadmin_cannot_delete: 'Sistem yöneticisi hesabı silinemez.',
      srv_err_cannot_delete_self: 'Kendi hesabınızı silemezsiniz.',
      srv_err_not_found: 'API endpoint bulunamadı.'
    },

    en: {
      page_title: 'AYBU Academic Award System',
      skip_to_content: 'Skip to main content',
      header_logo_aria: 'AYBU Academic Award System',
      header_brand_pre: 'AYBU',
      header_brand_bold: 'Academic Award System',
      btn_menu_aria: 'Menu',
      nav_user_menu_aria: 'User menu',
      btn_change_password: 'Change Password',
      btn_change_password_aria: 'Change password',
      btn_logout: 'Log Out',
      btn_logout_aria: 'Log out',

      login_university_name: 'Ankara Yıldırım Beyazıt University',
      login_system_name: 'Academic Award System',
      label_email: 'Email',
      placeholder_email: 'Enter your email address',
      label_password: 'Password',
      placeholder_password: 'Enter your password',
      btn_toggle_password_aria: 'Show or hide password',
      btn_login: 'Log In',
      btn_register_link: 'Register',
      login_register_note: 'First time here? Please register',
      login_help_link: 'Having trouble logging in?',
      login_footer: 'AAS v1.0.0 © 2026 Ankara Yıldırım Beyazıt University',

      register_heading: 'Ankara Yıldırım Beyazıt University',
      register_subtitle: 'Academic Award System — Registration Form',
      label_firstname: 'First Name',
      placeholder_firstname: 'Your first name',
      label_lastname: 'Last Name',
      placeholder_lastname: 'Your last name',
      label_title: 'Title',
      placeholder_title_select: 'Select title',
      title_prof_dr: 'Prof. Dr.',
      title_doc_dr: 'Assoc. Prof. Dr.',
      title_dr_ogr_uyesi: 'Asst. Prof. Dr.',
      title_ogr_gor_dr: 'Lecturer Dr.',
      title_ogr_gor: 'Lecturer',
      title_ars_gor_dr: 'Research Asst. Dr.',
      title_ars_gor: 'Research Asst.',
      label_email_note: 'Only @aybu.edu.tr email addresses are accepted.',
      label_reg_password: 'Password',
      placeholder_reg_password: 'At least 6 characters',
      label_reg_password_confirm: 'Password (Confirm)',
      placeholder_reg_password_confirm: 'Re-enter your password',
      label_faculty: 'Faculty / Unit',
      placeholder_faculty_select: 'Select faculty',
      label_dept: 'Department',
      placeholder_dept_select: 'Select',
      btn_register: 'Register',
      link_go_login: 'Already have an account? Log in',

      verify_heading: 'Email Verification',
      verify_subtitle: 'Enter the 6-digit code sent to your registration email.',
      label_verify_code: 'Verification Code',
      placeholder_verify_code: '123456',
      btn_verify: 'Verify and Complete Registration',
      link_resend_code: 'Resend code',
      link_back_to_register: 'Back to registration form',

      sidebar_toggle_aria: 'Toggle sidebar',
      profile_loading: 'Loading...',
      sidebar_panel_aria: 'Panel menu',
      btn_sidebar_dashboard: 'Overview',
      btn_sidebar_new_app: 'New Application',
      btn_sidebar_my_apps: 'My Applications',

      guide_card_heading: 'Calculation Guide & Application Principles',
      guide_table_caption: 'Calculation guide and application principles table',
      guide_col_topic: 'Topic',
      guide_col_description: 'Description',

      my_apps_heading: 'My Applications',
      my_apps_desc: 'Your academic award application history and current status.',
      btn_back_to_panel: 'Back to Panel',
      my_apps_table_caption: 'Application history table',
      th_app_year: 'Application Year',
      th_app_category: 'Applied Category',
      th_calculated_score: 'Calculated Score',
      th_approved_score: 'Approved Score',
      th_last_update: 'Last Updated',
      th_status: 'Status',
      th_actions: 'Actions',
      no_applications_msg: 'You have no applications yet. Use the "New Application" button to calculate your score and apply.',
      mobile_nav_aria: 'Quick access',
      btn_mobile_new_app: 'New Application',
      btn_mobile_my_apps: 'My Applications',

      btn_back_to_dashboard: 'Back to Panel',
      app_form_title_new: 'New Academic Award Application',
      app_form_title_edit: 'Edit Application',
      revision_note_heading: 'Revision Note',
      revision_note_default: 'Revision requested by the committee. Please update your application according to the notes.',
      step_nav_aria: 'Application steps',
      step1_label: 'General Information',
      step2_label: 'Activity Data Entry',
      step3_label: 'Evidence Documents & Confirmation',

      step1_card_heading: 'Applicant & Category Information',
      label_app_year: 'Application Year',
      help_app_year: 'Select the academic year you wish to apply for.',
      label_app_category: 'Applied Category',
      placeholder_app_category: 'Please select your application category',
      cat1_option: 'Category 1: Research, Publication, Events & Innovative Design',
      cat2_option: 'Category 2: Project (Completed)',
      cat3_option: 'Category 3: Patent and Utility Model',
      cat4_option: 'Category 4: Academic Advising, Education & Institutional Contribution',
      help_app_category: 'Each applicant may select only one category.',
      alert_one_category_rule: 'Important Rule: Each applicant may apply under only one category. Calculations in the scoring table will be valid only for the selected category.',
      category_info_heading: 'Information About Your Selected Category',
      category_info_subtext: 'Please read the following notes about your category before proceeding.',
      category_info_ack_label: 'I have read and understood the information above.',
      avesis_ack_label: 'I declare that all academic activity information in my AVESIS profile is complete and up to date.',
      btn_step1_next: 'Next Step',
      btn_step1_next_tooltip_no_cat: 'You must select a category',
      btn_step1_next_tooltip_no_ack: 'You must confirm the category information',
      btn_step1_next_tooltip_no_avesis: 'You must confirm the AVESIS declaration',
      btn_step1_next_tooltip_ok: 'Go to Next Step',

      calc_header_title: 'Category Scoring Table',
      calc_header_hint: 'Fill in the pink fields. Blue fields are calculated automatically.',
      calc_total_label: 'TOTAL SCORE',
      calc_table_caption: 'Academic activity scoring table.',
      th_activity_type: 'Activity Type (Scope)',
      th_base_score: 'Base Score',
      th_max_score: 'Max Score',
      th_value: 'Value',
      th_ratio: 'Contribution Ratio (0.01–1.00)',
      th_ratio_help_aria: 'Show contribution ratio table',
      th_ratio_help_title: 'How do I calculate my contribution ratio?',
      th_total_score: 'Total Score',
      calc_grand_total_label: 'CATEGORY TOTAL SCORE:',
      max_text_no_limit: 'No Limit',
      btn_step2_prev: 'Previous Step',
      btn_step2_next: 'Next Step (Documents)',

      step3_heading: 'Application Supporting Documents',
      tesvik_question_label: 'Did you apply for the Academic Incentive Allowance in 2025?',
      tesvik_yes: 'Yes',
      tesvik_no: 'No',
      evidence_section_heading: 'Evidence Documents',
      tesvik_checklist_intro: 'Please check the activities below for which you did not submit evidence in your Academic Incentive application:',
      evidence_no_activities_msg: 'You have not entered any activity data. Please go back and fill in the activities you expect to receive points for.',
      evidence_all_covered_msg: 'There are no activities requiring evidence upload. You may submit the application.',
      evidence_help_text_no: 'Since you did not apply for the Academic Incentive Allowance, you must upload evidence for all activities you entered (e.g., article first page, project approval letter, patent certificate, etc.).',
      evidence_help_text_yes: 'Please check the activities for which you did not submit evidence in your Academic Incentive application. You will only need to upload evidence for the checked items.',
      btn_upload_file: 'Upload File',
      upload_status_pending: 'Not uploaded (PDF/Image)',
      btn_remove_file_aria: 'Remove file',
      aria_ratio_input: '{label} contribution ratio, between 0.01 and 1.00',
      aria_month_input: '{label} months count',
      aria_count_input: '{label} {unit} value',
      unit_research: 'research',
      unit_item: 'item',
      unit_month: 'month',
      upload_evidence_aria: 'Upload evidence for {label}',
      evidence_doc_singular: 'Evidence Document',
      appeal_badge: 'APPEAL',
      btn_step3_prev: 'Previous Step',
      btn_save_draft: 'Save as Draft',
      btn_submit_application: 'Submit Application',
      btn_submit_title_no_tesvik: 'Please answer the Academic Incentive application question.',
      btn_submit_title_missing_evidence: 'Please upload files for all activities requiring evidence.',
      btn_submit_title_ready: 'Submit application',

      stat_total_apps_label: 'Total Applications',
      stat_pending_apps_label: 'Awaiting Review',
      stat_approved_apps_label: 'Approved Applications',
      stat_rejected_apps_label: 'Rejected Applications',

      admin_tabs_aria: 'Admin panel tabs',
      tab_submissions: 'Applications',
      tab_config: 'Scoring Criteria',
      tab_users: 'User Management',

      admin_apps_desc: 'List, search, and filter all applications in the admin panel.',
      filter_aria: 'Application filters',
      label_admin_search: 'Search by name or email',
      placeholder_admin_search: 'Search by name or email',
      help_admin_search: 'Filter by academician name or email address.',
      label_filter_status: 'Status Filter',
      filter_status_all: 'Show all statuses',
      filter_status_draft: 'Draft',
      filter_status_submitted: 'Pending Review',
      filter_status_approved: 'Approved',
      filter_status_rejected: 'Rejected',
      filter_status_revision: 'Revision Requested',
      filter_status_in_review: 'Appeal / Under Review',
      help_filter_status: 'Filter the list by application status.',
      label_filter_faculty: 'Faculty Filter',
      filter_faculty_all: 'Show all faculties',
      help_filter_faculty: 'Filter applications by faculty.',
      admin_table_caption: 'Admin applications list',
      th_academician: 'Academician',
      th_faculty_dept: 'Faculty / Department',
      th_year: 'Application Year',
      th_category: 'Category',
      no_results_msg: 'No applications found matching the search criteria.',

      config_heading: 'Scoring Criteria and Limits',
      config_desc: 'Select a category below to live-update base scores and maximum score limits.',
      label_config_category: 'Scoring Category',
      config_cat1_option: 'Category 1: Research, Publication, Events',
      config_cat2_option: 'Category 2: Project (Completed)',
      config_cat3_option: 'Category 3: Patent and Utility Model',
      config_cat4_option: 'Category 4: Academic Advising and Education',
      config_table_caption: 'Scoring criteria configuration table',
      th_config_activity: 'Activity Type',
      th_config_base: 'Base Score',
      th_config_max: 'Max Score Limit (0 = No Limit)',
      btn_save_config: 'Save Configuration',

      users_heading: 'User & Account Management',
      users_desc: 'Add, edit, reset passwords, or delete all academician and committee accounts here.',
      btn_add_user: 'Add New User',
      stat_total_users_label: 'Total Accounts',
      stat_academic_users_label: 'Academicians',
      stat_faculty_admins_label: 'Committee Administrators',
      stat_all_applications_label: 'Total Applications',
      users_filter_aria: 'User filters',
      label_users_search: 'Search user',
      placeholder_users_search: 'Search by name, email, or username',
      label_users_filter_role: 'Account Type',
      filter_role_all: 'All accounts',
      filter_role_academic: 'Academician',
      filter_role_faculty_admin: 'Faculty Committee',
      filter_role_system_admin: 'System Administrator',
      label_users_filter_faculty: 'Faculty',
      filter_users_faculty_all: 'All faculties',
      users_table_caption: 'System user list',
      th_full_name: 'Full Name',
      th_login_info: 'Login Info',
      th_account_type: 'Account Type',
      th_faculty_unit: 'Faculty / Unit',
      th_application_count: 'Applications',
      no_users_msg: 'No users found matching the search criteria.',

      btn_back_to_admin: 'Back to Panel',
      admin_detail_heading: 'Application Review & Evaluation',
      badge_in_review: 'Under Review',
      detail_applicant_heading: 'Applicant Information',
      detail_label_name: 'Full Name:',
      detail_label_title: 'Title / Position:',
      detail_label_faculty: 'Faculty:',
      detail_label_dept: 'Department:',
      detail_label_year: 'Application Year:',
      detail_label_category: 'Category:',
      detail_activities_heading: 'Declared Academic Activities',
      detail_activities_caption: 'Academic activities declared in the application and their calculated scores',
      th_detail_activity: 'Activity Type (Scope)',
      th_detail_base: 'Base Score',
      th_detail_max: 'Max Score',
      th_detail_count: 'Count',
      th_detail_ratio: 'Contribution Ratio',
      th_detail_score: 'Calculated Score',
      detail_docs_heading: 'Uploaded Documents',
      detail_evidence_label: 'Evidence Document',
      btn_view_document: 'View',
      detail_appeal_heading: 'Academician Appeal',
      detail_appeal_reasoning_label: 'Appeal Reasoning:',
      eval_decision_heading: 'Evaluation Decision',
      eval_calculated_label: 'Calculated Total Score:',
      label_eval_notes: 'Committee Evaluation Note',
      help_eval_notes: 'Providing a rationale is mandatory for revision or rejection decisions.',
      label_appeal_response: 'Appeal Response',
      placeholder_appeal_response: 'Please enter the decision and explanation for the appeal',
      help_appeal_response: 'Write your official response to the academician\'s appeal.',
      label_approved_score: 'Approved Score',
      placeholder_approved_score: 'Please enter the approved score',
      help_approved_score: 'The final score approved by the committee.',
      placeholder_eval_notes: 'Please describe the rationale for revision, rejection, or approval in detail',
      btn_approve: 'Approve Application',
      btn_request_revision: 'Request Revision',
      btn_reject: 'Reject Application',

      modal_add_user_title: 'Add User',
      modal_close_aria: 'Close window',
      label_user_role: 'Account Type',
      option_role_academic: 'Academician',
      option_role_faculty_admin: 'Faculty Committee Administrator',
      label_user_email: 'Email',
      placeholder_user_email: 'example@aybu.edu.tr',
      label_username: 'Username',
      placeholder_username: 'username',
      label_user_name: 'Full Name',
      placeholder_user_name: 'Full Name',
      label_user_title: 'Title',
      title_komisyon: 'Committee',
      label_user_password: 'Password',
      placeholder_user_password: 'At least 6 characters',
      label_user_faculty: 'Faculty / Unit',
      label_user_dept: 'Department',
      placeholder_user_dept_first: 'Select faculty first',
      btn_cancel: 'Cancel',
      btn_save: 'Save',
      modal_edit_user_title: 'Edit User',
      modal_new_user_title: 'Add New User',

      modal_reset_password_title: 'Reset Password',
      label_reset_new_password: 'New Password',
      placeholder_reset_new_password: 'At least 6 characters',
      label_reset_confirm_password: 'New Password (Confirm)',
      placeholder_reset_confirm_password: 'Re-enter new password',
      btn_update_password: 'Update Password',

      modal_change_password_title: 'Change Password',
      label_current_password: 'Current Password',
      placeholder_current_password: 'Your current password',
      label_new_password: 'New Password',
      placeholder_new_password: 'At least 6 characters',
      label_confirm_password: 'New Password (Confirm)',
      placeholder_confirm_password: 'Re-enter your new password',

      modal_appeal_title: 'Appeal Application Result',
      modal_appeal_close_aria: 'Close appeal window',
      modal_appeal_desc: 'Please review the committee\'s decision and note. If you wish to appeal, state your valid academic grounds and any additional explanations.',
      appeal_admin_notes_label: 'Committee Note',
      label_appeal_reasoning: 'Your Appeal Reasoning',
      label_appeal_reasoning_required: '(required)',
      placeholder_appeal_reasoning: 'Please describe your appeal reasoning in detail',
      help_appeal_reasoning: 'Clearly state the academic grounds supporting your appeal.',
      label_appeal_attachment: 'Attachment',
      appeal_attachment_optional: '(optional)',
      appeal_file_placeholder: 'Click to attach a document',
      appeal_file_size_hint: 'PDF or image (max 10 MB)',
      btn_remove_appeal_file_aria: 'Remove attached document',
      appeal_file_input_aria: 'Select appeal document',
      btn_cancel_appeal: 'Close',
      btn_submit_appeal: 'Submit Appeal',

      katki_modal_title: 'Contribution Ratio Table for Collaborative Work',
      katki_modal_close_aria: 'Close',
      katki_modal_intro: 'The table below is taken from Table 2 of the Academic Promotion and Appointment Criteria Directive. Find your contribution ratio based on your name order and the total number of authors.',
      katki_table_col_order: 'Name Order',
      katki_table_col_authors: 'Number of Authors in Collaborative Work',
      katki_author_1: '1st Author',
      katki_author_2: '2nd Author',
      katki_author_3: '3rd Author',
      katki_author_4: '4th Author',
      katki_author_5: '5th Author',
      katki_author_6: '6th Author',
      katki_author_7plus: '7th and beyond',
      katki_modal_footnote: '* Standard rounding applies if the value is not a whole number. Enter the ratio as a decimal (e.g., 90% → 0.90).',

      arastirma_modal_title: 'Research Activity — About Monthly Entry',
      arastirma_modal_close_aria: 'Close',
      arastirma_modal_intro: 'Research activities are scored using the formula: Base Score × Months. If you conducted multiple research activities of different durations, enter each on a separate row.',
      arastirma_modal_example_label: 'Example:',
      arastirma_modal_example: 'You conducted 3 separate domestic research activities — one for 4 months, one for 6 months, one for 8 months.',
      arastirma_modal_example_detail: '→ Enter 4 in the first box, press +, enter 6, press + again, enter 8. The system calculates a total of 18 months.',
      arastirma_modal_rule: 'The research must be conducted outside the applicant\'s home institution for at least 1 month with university board approval, and the final report must be approved by both institutions.',
      arastirma_modal_li1: 'International research is scored for a maximum of 12 months (max 120 points).',
      arastirma_modal_li2: 'Domestic research is scored for a maximum of 12 months (max 60 points).',
      arastirma_modal_li3: 'The contribution ratio is only applicable in cases of joint principal investigators.',
      arastirma_modal_source: 'Source: Academic Incentive Allowance 2025 Activity Year Implementation Procedures',
      btn_add_month_aria: 'Add new research row',
      btn_add_month_title: 'Add research',
      btn_remove_month_aria: 'Remove this row',

      idle_modal_title: 'Session Timeout Warning',
      idle_modal_desc: 'Your session is about to be closed due to inactivity.',
      idle_countdown_text: 'seconds',
      idle_continue_question: 'Do you want to continue?',
      idle_countdown_label: 'Your session will be automatically closed in {n} seconds.',
      btn_idle_logout: 'Log Out',
      btn_idle_stay: 'Continue',

      footer_text: '© 2026 Ankara Yıldırım Beyazıt University. AYBU Academic Award System Web Portal. All Rights Reserved.',
      toast_close_aria: 'Close notification',
      toast_welcome: 'Welcome, {title} {name}!',
      toast_logout: 'Session closed.',
      toast_idle_logout: 'Session automatically closed due to inactivity.',
      toast_reg_success: 'Registration successful! Please log in.',
      toast_verification_sent: 'Verification code has been sent to your email address.',
      toast_verification_resent: 'Verification code has been resent.',
      toast_evidence_uploaded: 'Evidence file uploaded successfully.',

      error_email_required: 'Enter your email address or admin username.',
      error_invalid_email: 'Enter a valid email address.',
      error_password_required: 'Enter your password.',
      error_form_invalid: 'Please fill in all fields in the registration form correctly.',
      error_password_too_short: 'Password must be at least 6 characters.',
      error_passwords_mismatch: 'The passwords you entered do not match. Please enter the same password in both fields.',
      error_email_domain: 'Registration is only available for @aybu.edu.tr email addresses.',
      error_faculty_dept_required: 'Please select your faculty and department from the list.',
      error_dept_mismatch: 'The selected department does not match the faculty. Please select again.',
      error_verify_no_email: 'Please fill out the registration form first.',
      error_new_passwords_mismatch: 'New passwords do not match.',
      tooltip_select_category: 'Please select a category',
      tooltip_ack_category_info: 'You must confirm the category information',
      tooltip_ack_avesis: 'You must confirm the AVESIS declaration',
      tooltip_next_step: 'Go to Next Step',
      error_category_required: 'Please select the category you wish to apply for.',
      error_category_ack_required: 'You must confirm the category information before proceeding.',
      error_no_activity_data: 'Please enter the count or hours for at least one academic activity.',
      error_tesvik_question: 'Please answer the Academic Incentive application question.',
      error_missing_evidence: 'Please upload files for all activities requiring evidence.',
      error_revision_required: 'A rationale note is mandatory for rejection or revision decisions.',
      error_apps_load_failed: 'An error occurred while loading applications.',
      error_api_response: 'Could not retrieve API response. Please restart the server and try again.',
      error_unexpected_response: 'Unexpected response received from the server.',
      error_api_generic: 'An API error occurred.',

      confirm_delete_own_app: 'Are you sure you want to delete this application? After deletion, you can re-apply under a different category.',
      confirm_delete_admin_app: 'Are you sure you want to permanently delete the application of {name}?',
      confirm_delete_user: 'Are you sure you want to delete the account of {name} and all associated applications?',
      toast_blocked_new_app: 'You cannot apply under a different category. Please delete your existing application and reapply.',
      new_app_blocked_title: 'To apply under a different category, please delete your current application first.',

      status_submitted: 'Submitted',
      status_in_review: 'Under Review',
      status_approved: 'Approved',
      status_rejected: 'Rejected',
      status_revision_required: 'Revision Required',
      status_draft: 'Draft',
      status_review_waiting: 'Awaiting Review',
      status_appeal_review: 'Appeal / Under Review',
      status_revision_requested: 'Revision Requested',
      status_evaluating: 'Under Evaluation',

      btn_edit_app: 'Edit',
      btn_view_app: 'View',
      btn_appeal_app: 'Appeal',
      btn_delete_app: 'Delete',
      btn_evaluate_app: 'Evaluate',
      badge_appeal_marker: 'APPEAL',
      btn_back_override: 'Go Back',

      role_system_admin: 'System Administrator',
      role_faculty_admin: 'Faculty Committee',
      role_academic: 'Academician',
      role_commission_label: 'Committee',
      faculty_commission_suffix: 'Academic Award Committee',
      unknown_applicant: 'Unknown',
      no_reason_provided: 'No reason provided.',
      reset_password_label: 'Set a new password for {name}\'s account.',
      faculty_admin_banner: 'You are viewing only {faculty} applications.',
      admin_config_cat_select_label: 'Scoring Category',
      config_base_aria: 'base score',
      config_max_aria: 'maximum score cap',

      srv_reg_success: 'Registration completed successfully. Please log in.',
      srv_reg_verified: 'Email verified, registration completed successfully.',
      srv_verification_sent: 'Verification code has been sent to your email address.',
      srv_verification_resent: 'Verification code has been resent.',
      srv_password_changed: 'Password updated successfully.',
      srv_app_deleted: 'Application deleted. You can now re-apply under a different category.',
      srv_appeal_submitted: 'Appeal submitted successfully.',
      srv_admin_app_deleted: 'Application deleted successfully.',
      srv_app_evaluated: 'Application evaluated successfully.',
      srv_user_updated: 'User updated.',
      srv_sysadmin_updated: 'System administrator updated.',
      srv_user_password_updated: 'User password updated.',
      srv_user_deleted: 'User and associated applications deleted.',
      srv_commission_created: 'Faculty committee account created.',
      srv_academic_created: 'Academician account created.',
      srv_config_saved: 'Category configuration saved successfully.',
      srv_app_draft_saved: 'Application saved as draft.',
      srv_app_submitted: 'Application submitted successfully.',
      srv_draft_updated: 'Draft updated.',

      srv_err_no_token: 'Unauthorized: No token found.',
      srv_err_invalid_token: 'Invalid or expired token.',
      srv_err_admin_required: 'Administrator privilege required for this action.',
      srv_err_sysadmin_required: 'System administrator privilege required for this action.',
      srv_err_all_fields_required: 'All fields are required.',
      srv_err_email_domain: 'Registration is only available for @aybu.edu.tr email addresses.',
      srv_err_invalid_faculty_dept: 'Invalid faculty or department selection. Please select from the list.',
      srv_err_email_exists: 'A user with this email address is already registered.',
      srv_err_admin_only_by_sysadmin: 'Admin accounts can only be created by the system administrator.',
      srv_err_verification_email_failed: 'Verification email could not be sent. Please try again later.',
      srv_err_email_code_required: 'Email and verification code are required.',
      srv_err_no_pending_reg: 'No pending registration found. Please fill out the registration form again.',
      srv_err_code_expired: 'Verification code has expired. Please fill out the registration form again.',
      srv_err_invalid_code: 'Incorrect verification code.',
      srv_err_email_required: 'Email is required.',
      srv_err_credentials_required: 'Enter username and password.',
      srv_err_login_user_not_found_academic: 'No user found with this email address. Please register.',
      srv_err_login_user_not_found_admin: 'Admin account not found. Please contact artuncay@aybu.edu.tr.',
      srv_err_login_wrong_password_admin: 'Incorrect password. Please contact artuncay@aybu.edu.tr.',
      srv_err_login_wrong_password: 'Incorrect password. If not registered, please sign up.',
      srv_err_passwords_required: 'Current password and new password are required.',
      srv_err_password_too_short: 'Password must be at least 6 characters.',
      srv_err_wrong_current_password: 'Current password is incorrect.',
      srv_err_user_not_found: 'User not found.',
      srv_err_config_missing: 'Category configuration is missing.',
      srv_err_upload_failed: 'File could not be uploaded.',
      srv_err_app_not_found_or_forbidden: 'Application not found or you do not have access.',
      srv_err_incomplete_app: 'Incomplete application data.',
      srv_err_duplicate_app: 'You already have an application in the system. Delete your existing application to apply under a different category.',
      srv_err_app_not_found: 'Application not found.',
      srv_err_app_locked: 'Submitted and under-review applications cannot be edited.',
      srv_err_category_locked: 'Application category cannot be changed. Delete this application and re-apply to change category.',
      srv_err_year_locked: 'Application year cannot be changed. Delete this application to create a new one.',
      srv_err_appeal_reason_required: 'Appeal reasoning is required.',
      srv_err_appeal_not_rejected: 'Appeals can only be filed for rejected applications.',
      srv_err_admin_not_found: 'Admin account not found.',
      srv_err_sysadmin_cannot_create: 'System administrator accounts cannot be created from this panel.',
      srv_err_commission_fields_required: 'Username and faculty are required for committee accounts.',
      srv_err_username_taken: 'This username is already in use.',
      srv_err_invalid_faculty: 'Invalid faculty selection.',
      srv_err_faculty_admin_exists: 'A committee account already exists for this faculty.',
      srv_err_academic_fields_required: 'Email, title, faculty, and department are required for academician accounts.',
      srv_err_sysadmin_type_locked: 'System administrator account type cannot be changed.',
      srv_err_sysadmin_cannot_assign: 'System administrator accounts cannot be assigned from this panel.',
      srv_err_invalid_eval_status: 'Invalid evaluation status.',
      srv_err_eval_forbidden: 'You do not have permission to evaluate this application.',
      srv_err_sysadmin_cannot_delete: 'System administrator account cannot be deleted.',
      srv_err_cannot_delete_self: 'You cannot delete your own account.',
      srv_err_not_found: 'API endpoint not found.'
    }
  };

  // ----------------------------------------------------------
  // GUIDE TABLE ROWS (HTML content per language)
  // ----------------------------------------------------------
  const GUIDE_ROWS = {
    tr: [
      {
        topic: '<strong>Genel İşleyiş</strong>',
        desc: `<p>Bu web portalı; Ankara Yıldırım Beyazıt Üniversitesi Akademik Yükseltilme ve Atanma Kriterleri Yönergesi, Akademik Teşvik Ödeneği Yönetmeliği ve ilgili yıl Uygulama Usul ve İlkeleri esas alınarak hazırlanmış olup başvuru sürecinizi dijital ortamda otomatik puan hesaplamasıyla yönetmenizi sağlar.</p>
               <ul>
                 <li>Sol menüden <strong>"Yeni Başvuru"</strong> seçeneğine tıklayarak başvurunuzu oluşturunuz; sisteme girdiğiniz faaliyet bilgileri otomatik olarak puanlanır.</li>
                 <li>Puanlamaya esas alınacak tüm faaliyetlerin AVESİS sistemine eksiksiz olarak girilmiş olması zorunludur. Aksi takdirde başvurular değerlendirmeye alınmayacaktır.</li>
                 <li>Her başvuru sahibi sadece bir kategoriden başvuru yapabilir.</li>
                 <li>Başvuru yapabilmek için en az 3 yıl AYBÜ'de çalışmış olmak gerekmektedir.</li>
                 <li>Ödül Sistemi fakülte bazlı değerlendirme yapmaktadır.</li>
                 <li>Aynı akademik faaliyet (aynı yayın, aynı eser, aynı patent, aynı etkinlik vb.) birden fazla kez puanlandırılamaz.</li>
                 <li>Çok yazarlı / çok yürütücülü çalışmalarda ilgili satırda <strong>"Katkı Oranı"</strong> alanını doldurunuz.</li>
               </ul>`
      },
      {
        topic: '<strong>Kanıt Belgeleri</strong>',
        desc: `<p>Komisyon, kanıt belgesi değerlendirmesinde öncelikle <strong>2025 yılı Akademik Teşvik Ödeneği başvurusunda ibraz edilen belgeler</strong>i esas almaktadır. Akademik Teşvik başvurusunda belgelerini eksiksiz ibraz etmiş başvuruculardan ayrıca kanıt talep edilmeyecektir.</p>
               <p>Ancak aşağıdaki durumlarda ilgili faaliyete ait kanıt belgesini yüklemeniz <strong>zorunludur</strong>:</p>
               <ul>
                 <li>2025 yılında <strong>Akademik Teşvik Ödeneği başvurusu yapmadıysanız</strong>, veya</li>
                 <li>Akademik Teşvik başvurusunda bu ödül hesaplamasında kullandığınız <strong>ilgili faaliyet için kanıt ibraz etmediyseniz</strong>.</li>
               </ul>`
      },
      {
        topic: '<strong>⚠️ Önemli Not</strong>',
        desc: 'Başvuru öncesinde <strong>AVESİS profilinizin güncel ve eksiksiz</strong> olduğundan emin olunuz. Profil eksiklikleri veya hatalı bilgiler başvurunuzun geçersiz sayılmasına yol açabilir.',
        rowStyle: 'background-color: #fff5f5;',
        tdStyle: 'color: #c0392b;'
      },
      {
        topic: '<strong>Taban Puan</strong>',
        desc: 'Her faaliyetin yönergede belirlenmiş standart bir taban puanı vardır. Sistem bu değerleri otomatik olarak uygular; herhangi bir değişiklik yapmanıza gerek yoktur.'
      },
      {
        topic: '<strong>Katkı Oranı</strong>',
        desc: `<p>Ortak çalışmalarda (çok yazarlı/çok yürütücülü çalışmalarda) ilgili faaliyet satırında <strong>"Katkı Oranı"</strong> alanına payınızı giriniz (0.01 – 1.00).</p>
               <p>Katkı oranı hesabında Akademik Yükseltilme ve Atanma Kriterleri Yönergesi, Sayfa 26'da yer alan Tablo 2 dikkate alınmaktadır. Örneğin, 3 yazarlı bir makalede katkı oranları sırasıyla 1. yazar %90, 2. yazar %85, 3. yazar %80 şeklindedir.</p>
               <p><strong>Formül:</strong> Taban Puan × Adet × Katkı Oranı (Maksimum puan sınırı sistem tarafından otomatik uygulanır.)</p>`
      },
      {
        topic: '<strong>Maks Puan</strong>',
        desc: 'Her faaliyet türü için alınabilecek maksimum puan üst sınırı sistem tarafından otomatik olarak uygulanır. Bu sınırı aşan girişler otomatik olarak kırpılır; herhangi bir müdahalede bulunmanıza gerek yoktur.'
      }
    ],
    en: [
      {
        topic: '<strong>General Process</strong>',
        desc: `<p>This web portal has been prepared based on the Ankara Yıldırım Beyazıt University Academic Promotion and Appointment Criteria Directive, the Academic Incentive Allowance Regulation, and the relevant year's Implementation Procedures and Principles. It enables you to manage your application process digitally with automatic score calculation.</p>
               <ul>
                 <li>Click <strong>"New Application"</strong> in the left menu to create your application; the activity information you enter will be scored automatically.</li>
                 <li>All activities to be scored must be entered completely and accurately in the AVESIS system. Otherwise, applications will not be evaluated.</li>
                 <li>Each applicant may apply under only one category.</li>
                 <li>Applicants must have worked at AYBU for at least 3 years.</li>
                 <li>The Award System evaluates applications on a faculty basis.</li>
                 <li>The same academic activity (same publication, same work, same patent, same event, etc.) cannot be scored more than once.</li>
                 <li>For multi-authored / multi-PI work, fill in the <strong>"Contribution Ratio"</strong> field on the relevant row.</li>
               </ul>`
      },
      {
        topic: '<strong>Evidence Documents</strong>',
        desc: `<p>The committee primarily relies on <strong>documents submitted in the 2025 Academic Incentive Allowance application</strong> for evidence evaluation. Applicants who fully submitted documents for the Academic Incentive application will not be required to provide additional evidence.</p>
               <p>However, uploading evidence for the relevant activity is <strong>mandatory</strong> in the following cases:</p>
               <ul>
                 <li>If you <strong>did not apply for the Academic Incentive Allowance in 2025</strong>, or</li>
                 <li>If you <strong>did not submit evidence for the relevant activity</strong> used in this award calculation in your Academic Incentive application.</li>
               </ul>`
      },
      {
        topic: '<strong>⚠️ Important Note</strong>',
        desc: 'Before applying, ensure your <strong>AVESIS profile is up to date and complete</strong>. Profile deficiencies or incorrect information may result in your application being deemed invalid.',
        rowStyle: 'background-color: #fff5f5;',
        tdStyle: 'color: #c0392b;'
      },
      {
        topic: '<strong>Base Score</strong>',
        desc: 'Each activity has a standard base score defined in the directive. The system applies these values automatically; no changes are required from you.'
      },
      {
        topic: '<strong>Contribution Ratio</strong>',
        desc: `<p>For collaborative work (multi-authored/multi-PI), enter your share (0.01 – 1.00) in the <strong>"Contribution Ratio"</strong> field on the relevant activity row.</p>
               <p>Contribution ratio calculation is based on Table 2 on Page 26 of the Academic Promotion and Appointment Criteria Directive. For example, in a 3-author paper: 1st author 90%, 2nd author 85%, 3rd author 80%.</p>
               <p><strong>Formula:</strong> Base Score × Count × Contribution Ratio (Maximum score cap is applied automatically by the system.)</p>`
      },
      {
        topic: '<strong>Max Score</strong>',
        desc: 'The maximum score limit for each activity type is automatically enforced by the system. Entries exceeding this limit are automatically capped; no manual intervention is required.'
      }
    ]
  };

  // ----------------------------------------------------------
  // CATEGORY INFO ROW INNER HTML (TR cells, cloned into form)
  // ----------------------------------------------------------
  const CAT_INFO = {
    tr: {
      kat1: `<td data-label="Konu"><strong>Kategori 1<br>Araştırma, Yayın, Etkinlik ve Yenilikçi Tasarım</strong></td>
             <td data-label="Açıklama">
               <p><strong>Araştırma:</strong> Araştırmanın üniversite yönetim kurulunun izin kararıyla, en az 1 ay süreyle araştırmacının kadrosunun bulunduğu kurum dışında yürütülmüş olması ve sonuç raporunun hem üniversite hem de ilgili kurum tarafından onaylanmış olması gerekir. Yurt içi ve yurt dışı araştırmalar en fazla 12 ay üzerinden puanlanır; yurt dışı için aylık 10 puan (maks. 120), yurt içi için aylık 5 puan (maks. 60) verilir.</p>
               <p><strong>Yayın:</strong> SCI, SCI Expanded, SSCI ve AHCI makalelerin Q değerleri (Q1–Q4) veya tarandığı indeks (Scopus, SPORT Discus, ESCI, TR-Dizin) esas alınır. Uluslararası kitaplar için BKCI şartı aranır; ders kitabı dışındaki özgün bilimsel kitaplar ile aynı kitaptaki bölümlerin en fazla ikisi puanlanabilir. Uygunluk değerlendirmesinde Akademik Teşvik Ödeneği 2025 Faaliyet Yılı Uygulama Usul ve İlkeleri belirleyicidir.</p>
               <p><strong>Yenilikçi Tasarım:</strong> Özgün Eğitim Modeli, Yenilikçi İş Akışı ve Kurumsal Yazılım girdilerinde özgünlüğün ve katkının belgelenmesi zorunludur.</p>
               <p><strong>Katkı Oranı:</strong> Ortak çalışmalarda (çok yazarlı/çok yürütücülü) ilgili faaliyet satırında katkı oranınızı (0.01–1.00) giriniz. Hesaplama Akademik Yükseltilme ve Atanma Kriterleri Yönergesi Tablo 2 esas alınarak yapılır (örn. 3 yazarlı makalede: 1. yazar %90, 2. yazar %85, 3. yazar %80).</p>
               <p><strong>Formül:</strong> Taban Puan × Adet × Katkı Oranı — maksimum puan sınırı sistem tarafından otomatik uygulanır.</p>
             </td>`,
      kat2: `<td data-label="Konu"><strong>Kategori 2<br>Proje &amp; Fon</strong></td>
             <td data-label="Açıklama">
               <p>TÜBİTAK 1001, 1003, 1004, 1005, 1007, 1505, 2244, 3001, 3501, SAYEM, COST, Uluslararası İkili İşbirliği Programları, H2020 Projeleri ile ulusal veya uluslararası özel veya resmi kurum ve kuruluşlar tarafından desteklenmiş ve destek süresi dokuz aydan az olmayan Ar-Ge niteliğine haiz projeler bu kapsamda değerlendirilir.</p>
               <p>Projelerin başarı ile sonuçlandırılmış ve sonuç raporunun onaylanmış olması zorunludur. Uygunluk değerlendirmesinde Akademik Teşvik Ödeneği 2025 Faaliyet Yılı Uygulama Usul ve İlkeleri esas alınır. Sisteme girdiğiniz proje bilgileri otomatik olarak puanlanır.</p>
             </td>`,
      kat3: `<td data-label="Konu"><strong>Kategori 3<br>Patent &amp; Faydalı Model</strong></td>
             <td data-label="Açıklama">
               <p>Tescillenmiş uluslararası patent, ulusal patent ve faydalı modeller sisteme ayrı ayrı girilmelidir. Tescil tarihi esas alınır.</p>
               <p>Buluş uygunluk değerlendirmesinde Akademik Teşvik Ödeneği 2025 Faaliyet Yılı Uygulama Usul ve İlkeleri esas alınır.</p>
               <ul>
                 <li><strong>Ulusal Patent:</strong> Ulusal mevzuat kapsamında başvurusu yapılan ve inceleme raporu sonucunda Türk Patent ve Marka Kurumu tarafından verilen patent.</li>
                 <li><strong>Uluslararası Patent:</strong> Patent İşbirliği Antlaşması kapsamında yapılan ve uluslararası araştırma raporunda en az bir istemin patentlenebilirlik kriterlerini (yenilik, buluş basamağı, sanayiye uygulanabilirlik) sağladığı ifade edilen başvuru ya da Avrupa Patent Sözleşmesi kapsamında Avrupa Patent Ofisi tarafından verilen patent.</li>
               </ul>
               <p><strong>Katkı Oranı:</strong> Birden fazla buluş sahibi varsa ilgili faaliyet satırında katkı oranınızı (0.01–1.00) giriniz. Katkı oranı girilmemesi durumunda toplam puan, buluş sahibi sayısına bölünerek hesaplanır. Sisteme girdiğiniz bilgiler otomatik olarak puanlanır.</p>
             </td>`,
      kat4: `<td data-label="Konu"><strong>Kategori 4<br>Danışmanlık &amp; Katkı</strong></td>
             <td data-label="Açıklama">
               <p>Yüksek lisans ve doktora danışmanlıkları, yarışma/proje danışmanlığı, idari görevler ve mesleki gelişim faaliyetleri bu kategoride değerlendirilir. Uygunluk değerlendirmesinde Akademik Yükseltilme ve Atanma Kriterleri Yönergesi esas alınır; idari görevler için atama yazısı ve faaliyet raporu talep edilmektedir.</p>
               <p><strong>Mesleki Gelişim:</strong> Üniversitelere bağlı merkezler, Ulusal Ajans, TÜBİTAK gibi kamu kurumlarına bağlı merkezler ya da protokol kapsamındaki kurumlar tarafından sunulan seminer, webinar veya kurslarda <em>eğitici</em> ya da <em>öğrenici</em> olarak görev almayı kapsar. Öğrenici rolünde sertifika alınmış olması zorunludur; uluslararası akredite kurumlar da kabul edilir. Alınan eğitim doğrultusunda yeni eğitim planlanıp yürütülmesi durumunda eğitici rolü için ayrıca girdi yapılabilir.</p>
               <p><strong>Yarışma/Proje Danışmanlığı:</strong> TÜBİTAK 2209-A ve 2209-B, ÜNİDES, ESC30 (Avrupa Dayanışma Programı), Erasmus+ Gençlik Projeleri, TEKNOFEST vb. programlardaki danışmanlık faaliyetlerini kapsar.</p>
               <p><strong>Ders Yükü:</strong> Yıllık toplam ders saatinizi "Adet" alanına giriniz. Sistem otomatik olarak puanlar (örn. 350 saat × 1 puan = 350 puan). Öğrenci/öğrenci grubuyla birebir çalışmayan ve haftalık programa yansımayan etkinlikler bu kapsamda değerlendirilemez.</p>
               <p><strong>Öğrenci OBS Değerlendirme Formları:</strong> Yıl boyunca yürütülen derslere ait OBS değerlendirme formlarının 5 üzerinden genel ortalamasını "Katsayı" alanına giriniz (örn. ortalama 4/5 ise → 4 × 20 = 80 puan). Sistem puanı otomatik hesaplar.</p>
               <p><strong>Katkı Oranı:</strong> Birden fazla katkı sahibi varsa ilgili faaliyet satırında katkı oranınızı (0.01–1.00) giriniz. Girilmemesi durumunda toplam puan kişi sayısına bölünerek hesaplanır. Maksimum puan sınırı sistem tarafından otomatik uygulanır.</p>
             </td>`
    },
    en: {
      kat1: `<td data-label="Topic"><strong>Category 1<br>Research, Publication, Events &amp; Innovative Design</strong></td>
             <td data-label="Description">
               <p><strong>Research:</strong> The research must be conducted outside the applicant's home institution for at least 1 month with university board approval, and the final report must be approved by both the university and the relevant institution. Scored for a maximum of 12 months; 10 points/month (max 120) for international, 5 points/month (max 60) for domestic.</p>
               <p><strong>Publication:</strong> Q values (Q1–Q4) of SCI, SCI-Expanded, SSCI, and AHCI articles, or the index they are indexed in (Scopus, SPORT Discus, ESCI, TR-Dizin), are used as the basis. International books require BKCI indexing; original scientific books (excluding textbooks) and at most two chapters from the same book may be scored. Eligibility is determined by the Academic Incentive Allowance 2025 Activity Year Implementation Procedures and Principles.</p>
               <p><strong>Innovative Design:</strong> For Original Educational Model, Innovative Workflow, and Institutional Software entries, documentation of originality and contribution is mandatory.</p>
               <p><strong>Contribution Ratio:</strong> For collaborative work (multi-authored/multi-PI), enter your contribution ratio (0.01–1.00) on the relevant activity row. Calculation is based on the Academic Promotion and Appointment Criteria Directive Table 2 (e.g., for a 3-author article: 1st author 90%, 2nd author 85%, 3rd author 80%).</p>
               <p><strong>Formula:</strong> Base Score × Count × Contribution Ratio — the maximum score cap is applied automatically by the system.</p>
             </td>`,
      kat2: `<td data-label="Topic"><strong>Category 2<br>Project &amp; Funding</strong></td>
             <td data-label="Description">
               <p>TÜBİTAK 1001, 1003, 1004, 1005, 1007, 1505, 2244, 3001, 3501, SAYEM, COST, International Bilateral Cooperation Programs, H2020 Projects, and R&amp;D projects supported by national or international public/private institutions lasting at least nine months are evaluated under this category.</p>
               <p>Projects must have been successfully completed and have an approved final report. Eligibility is determined by the Academic Incentive Allowance 2025 Activity Year Implementation Procedures and Principles. Project information entered into the system is scored automatically.</p>
             </td>`,
      kat3: `<td data-label="Topic"><strong>Category 3<br>Patent &amp; Utility Model</strong></td>
             <td data-label="Description">
               <p>Registered international patents, national patents, and utility models must be entered separately. The registration date is used as the basis.</p>
               <p>Invention eligibility is determined by the Academic Incentive Allowance 2025 Activity Year Implementation Procedures and Principles.</p>
               <ul>
                 <li><strong>National Patent:</strong> A patent filed under national legislation and granted by the Turkish Patent and Trademark Office following an examination report.</li>
                 <li><strong>International Patent:</strong> An application filed under the Patent Cooperation Treaty where the international search report states at least one claim satisfies patentability criteria (novelty, inventive step, industrial applicability), or a patent granted by the European Patent Office under the European Patent Convention.</li>
               </ul>
               <p><strong>Contribution Ratio:</strong> If there are multiple inventors, enter your contribution ratio (0.01–1.00) on the relevant activity row. If not entered, the total score is divided by the number of inventors. Information entered into the system is scored automatically.</p>
             </td>`,
      kat4: `<td data-label="Topic"><strong>Category 4<br>Advisory &amp; Contribution</strong></td>
             <td data-label="Description">
               <p>Master's and doctoral thesis supervision, competition/project advising, administrative duties, and professional development activities are evaluated in this category. Eligibility is determined by the Academic Promotion and Appointment Criteria Directive; appointment letters and activity reports are required for administrative roles.</p>
               <p><strong>Professional Development:</strong> Covers serving as trainer or trainee in seminars, webinars, or courses offered by university-affiliated centers, National Agency, TÜBİTAK-affiliated centers, or partner institutions. A certificate is required for the trainee role; internationally accredited institutions are also accepted. If new training is planned and delivered based on the training received, a separate entry may be made for the trainer role.</p>
               <p><strong>Competition/Project Advisory:</strong> Covers advisory activities in TÜBİTAK 2209-A and 2209-B, ÜNİDES, ESC30 (European Solidarity Programme), Erasmus+ Youth Projects, TEKNOFEST, etc.</p>
               <p><strong>Course Load:</strong> Enter your total annual teaching hours in the "Count" field. The system scores automatically (e.g., 350 hours × 1 point = 350 points). Activities that do not involve direct one-on-one work with students and are not reflected in the weekly schedule cannot be evaluated under this category.</p>
               <p><strong>Student OBS Evaluation Forms:</strong> Enter the overall average of OBS evaluation forms for courses taught throughout the year (out of 5) in the "Coefficient" field (e.g., average 4/5 → 4 × 20 = 80 points). The system calculates the score automatically.</p>
               <p><strong>Contribution Ratio:</strong> If there are multiple contributors, enter your contribution ratio (0.01–1.00) on the relevant activity row. If not entered, the total score is divided by the number of contributors. The maximum score cap is applied automatically by the system.</p>
             </td>`
    }
  };

  // ----------------------------------------------------------
  // CATEGORY & ITEM LABEL TRANSLATIONS
  // ----------------------------------------------------------
  const CAT_NAMES = {
    kat1: { tr: 'Kategori 1: Araştırma, Yayın, Etkinlik ve Yenilikçi Tasarım', en: 'Category 1: Research, Publication, Events & Innovative Design' },
    kat2: { tr: 'Kategori 2: Proje (Tamamlanmış)', en: 'Category 2: Project (Completed)' },
    kat3: { tr: 'Kategori 3: Patent ve Faydalı Model', en: 'Category 3: Patent & Utility Model' },
    kat4: { tr: 'Kategori 4: Akademik Danışmanlık, Eğitim ve Kurumsal Katkı', en: 'Category 4: Academic Advisory, Training & Institutional Contribution' },
  };

  const ITEM_LABELS = {
    kat1_row1:  { tr: 'Araştırma: Yurt Dışı (Taban Puan × Ay)', en: 'Research Abroad (Base Score × Month)' },
    kat1_row2:  { tr: 'Araştırma: Yurt İçi (Taban Puan × Ay)', en: 'Research Domestic (Base Score × Month)' },
    kat1_row3:  { tr: 'Makale: Q1 dergiler (SCI, SCI-E, SSCI, AHCI)', en: 'Article: Q1 Journals (SCI, SCI-E, SSCI, AHCI)' },
    kat1_row4:  { tr: 'Makale: WoS Q2 dergiler (SCI, SCI-E, SSCI, AHCI)', en: 'Article: WoS Q2 Journals (SCI, SCI-E, SSCI, AHCI)' },
    kat1_row5:  { tr: 'Makale: WoS Q3 dergiler (SCI, SCI-E, SSCI, AHCI)', en: 'Article: WoS Q3 Journals (SCI, SCI-E, SSCI, AHCI)' },
    kat1_row6:  { tr: 'Makale: WoS Q4 dergiler (SCI, SCI-E, SSCI, AHCI)', en: 'Article: WoS Q4 Journals (SCI, SCI-E, SSCI, AHCI)' },
    kat1_row7:  { tr: 'Makale: Scopus, SPORT Discus, ESCI Dergileri', en: 'Article: Scopus, SPORT Discus, ESCI-Index Journals' },
    kat1_row8:  { tr: 'Makale: TR-Dizin Dergileri', en: 'Article: TR-Index Journals' },
    kat1_row9:  { tr: 'Makale: Diğer Uluslararası/Ulusal Hakemli Dergiler', en: 'Article: Other Intl./National Peer-Reviewed Journals' },
    kat1_row10: { tr: 'Uluslararası Bilimsel Kitap (BKCI)', en: 'Intl. Scientific Book (BKCI)' },
    kat1_row11: { tr: 'Uluslararası Bilimsel Kitap Bölümü (BKCI)', en: 'Intl. Book Chapter (BKCI)' },
    kat1_row12: { tr: 'Diğer Ulusl./Ulusal Bilimsel Kitap', en: 'Other Intl./National Scientific Book' },
    kat1_row13: { tr: 'Diğer Ulusl./Ulusal Bilimsel Kitap Bölümü', en: 'Other Intl./National Book Chapter' },
    kat1_row14: { tr: 'Özgün Eğitim Modeli, Yenilikçi İş Akışı, Kurumsal Yazılım', en: 'Original Education Model, Innovative Workflow, Institutional Software' },
    kat1_row15: { tr: 'Uluslararası Kişisel Sergi, Özgün Tasarım, Birincilik Ödülü', en: 'Intl. Solo Exhibition, Original Design, First Place Award' },
    kat1_row16: { tr: 'Ulusal Kişisel Sergi, Özgün Tasarım, Birincilik Ödülü', en: 'National Solo Exhibition, Original Design, First Place Award' },
    kat1_row17: { tr: 'Uluslararası Karma Sergi, Bienal vb. Katılım', en: 'Intl. Group Exhibition, Biennial, etc. Participation' },
    kat1_row18: { tr: 'Ulusal Karma Sergi, Alanlara Özgü Grup Etkinliği', en: 'National Group Exhibition or Discipline-Specific Group Event' },
    kat2_row1:  { tr: 'Projede Yürütücü', en: 'Project Principal Investigator' },
    kat2_row2:  { tr: 'Projede Araştırmacı', en: 'Co-Investigator' },
    kat2_row3:  { tr: 'Projede Danışman', en: 'Project Consultant' },
    kat2_row4:  { tr: 'Projede Bursiyer', en: 'Project Scholar' },
    kat3_row1:  { tr: 'Uluslararası Tescillenmiş Patent', en: 'International Registered Patent' },
    kat3_row2:  { tr: 'Ulusal Tescillenmiş Patent', en: 'National Registered Patent' },
    kat3_row3:  { tr: 'Uluslararası Faydalı Model', en: 'International Utility Model' },
    kat3_row4:  { tr: 'Ulusal Faydalı Model', en: 'National Utility Model' },
    kat4_row1:  { tr: 'Mezun Edilen Doktora Öğrencisi', en: 'Graduated PhD Student' },
    kat4_row2:  { tr: 'Mezun Edilen Y. Lisans Öğrencisi', en: 'Graduated MA/MS Student' },
    kat4_row3:  { tr: 'Öğrenci Yarışma Derecesi/Proje Danışmanlığı', en: 'Student Competition Award/Project Advising' },
    kat4_row4:  { tr: 'Mesleki Gelişim (Eğitim Veren Rolü)', en: 'Professional Development (Instructor Role)' },
    kat4_row5:  { tr: 'Mesleki Gelişim (Eğitim Alan Rolü)', en: 'Professional Development (Learner Role)' },
    kat4_row6:  { tr: 'Ders Yükü (Taban Puan × Yıllık Toplam Ders Saati)', en: 'Course Load (Base Score × Total Annual Course Hours)' },
    kat4_row7:  { tr: 'Öğrenci OBS Değerlendirme Formları (Taban Puan × Anket Ort. Puan)', en: 'Student OBS Evaluation Forms (Base Score × Survey Avg. Score)' },
    kat4_row8:  { tr: 'Kurumsal Koordinatörlük-Komite Görevi', en: 'Institutional Coordinator-Committee Role' },
  };

  function tItem(id) {
    const entry = ITEM_LABELS[id];
    if (!entry) return id;
    return entry[currentLang] || entry.tr;
  }

  function tCat(id) {
    const entry = CAT_NAMES[id];
    if (!entry) return id;
    return entry[currentLang] || entry.tr;
  }

  // ----------------------------------------------------------
  // ACADEMIC UNIT NAME TRANSLATIONS (TR → EN)
  // ----------------------------------------------------------
  const UNIT_NAMES_EN = {
    // Faculties & Schools
    'Diş Hekimliği Fakültesi': 'Faculty of Dentistry',
    'Fen Bilimleri Enstitüsü': 'Institute of Natural and Applied Sciences',
    'Halk Sağlığı Enstitüsü': 'Institute of Public Health',
    'Havacılık ve Uzay Bilimleri Fakültesi': 'Faculty of Aviation and Space Sciences',
    'Hukuk Fakültesi': 'Faculty of Law',
    'İlahiyat Fakültesi': 'Faculty of Theology',
    'İletişim Fakültesi': 'Faculty of Communication',
    'İnsan ve Toplum Bilimleri Fakültesi': 'Faculty of Humanities and Social Sciences',
    'İşletme Fakültesi': 'Faculty of Business Administration',
    'Mimarlık ve Güzel Sanatlar Fakültesi': 'Faculty of Architecture and Fine Arts',
    'Mühendislik ve Doğa Bilimleri Fakültesi': 'Faculty of Engineering and Natural Sciences',
    'Sağlık Bilimleri Enstitüsü': 'Institute of Health Sciences',
    'Sağlık Bilimleri Fakültesi': 'Faculty of Health Sciences',
    'Sağlık Hizmetleri Meslek Yüksekokulu': 'Vocational School of Health Services',
    'Siyasal Bilgiler Fakültesi': 'Faculty of Political Sciences',
    'Sosyal Bilimler Enstitüsü': 'Institute of Social Sciences',
    'Sosyal Bilimler Meslek Yüksekokulu': 'Vocational School of Social Sciences',
    'Spor Bilimleri Fakültesi': 'Faculty of Sport Sciences',
    'Şereflikoçhisar Berat Cömertoğlu Meslek Yüksekokulu': 'Şereflikoçhisar Berat Cömertoğlu Vocational School',
    'Şereflikoçhisar Uygulamalı Bilimler Fakültesi': 'Şereflikoçhisar Faculty of Applied Sciences',
    'Teknik Bilimler Meslek Yüksekokulu': 'Vocational School of Technical Sciences',
    'Tıp Fakültesi': 'Faculty of Medicine',
    'Türk Sanat Müziği ve Devlet Konservatuvarı': 'Turkish Classical Music and State Conservatory',
    'Uluslararası İlişkiler ve Stratejik Araştırmalar Enstitüsü': 'Institute of International Relations and Strategic Research',
    'Yabancı Diller Yüksekokulu': 'School of Foreign Languages',
    'Rektörlük': 'Rectorate',
    // Departments
    'Diş Hekimliği': 'Dentistry',
    'Havacılık ve Uzay Bilimleri': 'Aviation and Space Sciences',
    'Hukuk': 'Law',
    'İlahiyat': 'Theology',
    'İletişim': 'Communication',
    'Bilgi ve Belge Yönetimi': 'Information and Records Management',
    'Bilim Tarihi': 'History of Science',
    'Doğu Dilleri ve Edebiyatı': 'Eastern Languages and Literatures',
    'Felsefe': 'Philosophy',
    'Mütercim ve Tercümanlık': 'Translation and Interpretation',
    'Psikoloji': 'Psychology',
    'Sanat Tarihi': 'Art History',
    'Sosyoloji': 'Sociology',
    'Tarih': 'History',
    'Türk Dili ve Edebiyatı': 'Turkish Language and Literature',
    'İşletme': 'Business Administration',
    'Uluslararası Ticaret ve İşletmecilik': 'International Trade and Business',
    'Yönetim Bilişim Sistemleri': 'Management Information Systems',
    'Dijital Oyun Tasarımı': 'Digital Game Design',
    'Endüstriyel Tasarım': 'Industrial Design',
    'Görsel İletişim Tasarımı': 'Visual Communication Design',
    'Mimarlık': 'Architecture',
    'Bilgisayar Mühendisliği': 'Computer Engineering',
    'Elektrik Elektronik Mühendisliği': 'Electrical and Electronics Engineering',
    'Endüstri Mühendisliği': 'Industrial Engineering',
    'Enerji Sistemleri Mühendisliği': 'Energy Systems Engineering',
    'İnşaat Mühendisliği': 'Civil Engineering',
    'Makine Mühendisliği': 'Mechanical Engineering',
    'Matematik': 'Mathematics',
    'Metalurji ve Malzeme Mühendisliği': 'Metallurgical and Materials Engineering',
    'Yazılım Mühendisliği': 'Software Engineering',
    'Beslenme ve Diyetetik': 'Nutrition and Dietetics',
    'Çocuk Gelişimi': 'Child Development',
    'Dil ve Konuşma Terapisi': 'Speech and Language Therapy',
    'Fizyoterapi ve Rehabilitasyon': 'Physiotherapy and Rehabilitation',
    'Hemşirelik': 'Nursing',
    'Odyoloji': 'Audiology',
    'Sağlık Yönetimi': 'Health Management',
    'Sosyal Hizmet': 'Social Work',
    'İktisat': 'Economics',
    'Maliye': 'Public Finance',
    'Siyaset Bilimi ve Kamu Yönetimi': 'Political Science and Public Administration',
    'Uluslararası İlişkiler': 'International Relations',
    'Antrenörlük Eğitimi': 'Coaching Education',
    'Egzersiz ve Spor Bilimleri': 'Exercise and Sport Sciences',
    'Spor Yöneticiliği': 'Sport Management',
    'Tıp': 'Medicine',
    'Ödül Değerlendirme Komisyonu': 'Award Evaluation Committee',
  };

  function tUnit(name) {
    if (!name) return name;
    if (currentLang === 'en') return UNIT_NAMES_EN[name] || name;
    return name;
  }

  // ----------------------------------------------------------
  // ENGINE
  // ----------------------------------------------------------
  let currentLang = localStorage.getItem('lang') || 'tr';

  function t(key, vars) {
    let str = (TRANSLATIONS[currentLang] || TRANSLATIONS.tr)[key];
    if (str === undefined) return key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), v);
      }
    }
    return str;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;
    document.title = t('page_title');

    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.setAttribute('title', t(el.dataset.i18nTitle));
    });

    renderGuideTable();
    renderCatInfoRows();
    updateLangButtons();
    if (typeof window.refreshProfileCard === 'function') window.refreshProfileCard();
  }

  function renderGuideTable() {
    const tbody = document.getElementById('guide-table-body');
    if (!tbody) return;
    const rows = GUIDE_ROWS[currentLang] || GUIDE_ROWS.tr;
    const colTopic = t('guide_col_topic');
    const colDesc = t('guide_col_description');
    tbody.innerHTML = rows.map(r => {
      const rowAttr = r.rowStyle ? ` style="${r.rowStyle}"` : '';
      const tdAttr = r.tdStyle ? ` style="${r.tdStyle}"` : '';
      return `<tr${rowAttr}>
        <td data-label="${colTopic}"${tdAttr}>${r.topic}</td>
        <td data-label="${colDesc}"${tdAttr}>${r.desc}</td>
      </tr>`;
    }).join('');
  }

  function renderCatInfoRows() {
    const catInfo = CAT_INFO[currentLang] || CAT_INFO.tr;
    ['kat1', 'kat2', 'kat3', 'kat4'].forEach(id => {
      const row = document.getElementById('info-row-' + id);
      if (row && catInfo[id]) row.innerHTML = catInfo[id];
    });
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    // Re-trigger category info clone if a category is selected
    const catSelect = document.getElementById('app-category-select');
    if (catSelect && catSelect.value) catSelect.dispatchEvent(new Event('change'));
  }

  function updateLangButtons() {
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('lang-active', btn.dataset.langBtn === currentLang);
    });
  }

  // Expose globals
  window.t = t;
  window.setLanguage = setLanguage;
  window.applyTranslations = applyTranslations;
  window.getCurrentLang = function () { return currentLang; };
  window.tUnit = tUnit;
  window.tItem = tItem;
  window.tCat = tCat;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { applyTranslations(); setTimeout(() => document.activeElement?.blur(), 0); });
  } else {
    applyTranslations();
    setTimeout(() => document.activeElement?.blur(), 0);
  }
})();
