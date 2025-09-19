pkgdatadir = get_option('datadir') / meson.project_name()
gnome = import('gnome')

blueprint_compiler = find_program('blueprint-compiler', required: true)

# blueprints = custom_target('blueprints',
#   input: files(
#     'shortcuts-dialog.blp',
#     'window.blp',
#   ),
#   output: '.',
#   command: [find_program('blueprint-compiler'), 'batch-compile', '--minify', '@OUTPUT@', '@CURRENT_SOURCE_DIR@', '@INPUT@'],
# )

blueprint_files = files(
    'shortcuts-dialog.blp',
    'window.blp',
)

compiled_blueprints = custom_target('compiled_blueprints',
  input: blueprint_files,
  output: '.',
  command: [
    find_program('blueprint-compiler'),
    'batch-compile',
    '@OUTPUT@',
    '@CURRENT_SOURCE_DIR@',
    '@INPUT@',
  ]
)

src_res = gnome.compile_resources('ir.hipoo.Shuttle.src',
  'ir.hipoo.Shuttle.src.gresource.xml',


  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir,
)

data_res = gnome.compile_resources('ir.hipoo.Shuttle.data',
  'ir.hipoo.Shuttle.data.gresource.xml',
  gresource_bundle: true,
  install: true,
  dependencies: compiled_blueprints,
  install_dir: pkgdatadir,
)

bin_conf = configuration_data()
bin_conf.set('GJS', find_program('gjs').full_path())
bin_conf.set('PACKAGE_VERSION', meson.project_version())
bin_conf.set('PACKAGE_NAME', meson.project_name())
bin_conf.set('prefix', get_option('prefix'))
bin_conf.set('libdir', get_option('prefix') / get_option('libdir'))
bin_conf.set('datadir', get_option('prefix') / get_option('datadir'))
bin_conf.set('resource_path', '/ir/hipoo/Shuttle')

configure_file(
  input: 'ir.hipoo.Shuttle.in',
  output: 'ir.hipoo.Shuttle',
  configuration: bin_conf,
  install: true,
  install_dir: get_option('bindir')
)
